package universe

import (
	"time"

	log "github.com/Sirupsen/logrus"

	"github.com/Shopify/sarama"
	"github.com/pkg/errors"
)

type UniverseStore interface {
	Put(key string, value []byte) error
	Listen(key string) (chan []byte, chan error)
	Close()
}

type KafkaStore struct {
	producer sarama.SyncProducer
	consumer sarama.Consumer
}

func NewKafkaStore(addrs []string) *KafkaStore {
	log.Println("Connecting to Kafka %v", addrs)
	var err error
	t := time.NewTimer(time.Second * 60)
	for {
		select {
		case <-t.C:
			panic(err)
		default:
			producer, err := sarama.NewSyncProducer(addrs, nil)
			if err != nil {
				log.Println(err)
				continue
			}
			consumer, err := sarama.NewConsumer(addrs, nil)
			if err != nil {
				log.Println(err)
				continue
			}
			return &KafkaStore{
				producer: producer,
				consumer: consumer,
			}
		}
	}
}

func (s *KafkaStore) Close() {
	s.producer.Close()
	s.consumer.Close()
}

func (s *KafkaStore) Listen(key string) (chan []byte, chan error) {
	outCh := make(chan []byte)
	errCh := make(chan error)

	go func() {
		defer func() {
			close(outCh)
			close(errCh)
		}()
		p, err := s.consumer.ConsumePartition(key, 0, sarama.OffsetOldest)
		if err != nil {
			log.Println("err", err)

			errCh <- err
			return
		}
		defer p.Close()
		for {
			select {
			case msg := <-p.Messages():
				outCh <- msg.Value
			case err := <-p.Errors():
				log.Println("err", err)
				errCh <- err
				return
			}
		}
	}()

	return outCh, errCh
}

func (s *KafkaStore) Put(key string, value []byte) error {
	msg := &sarama.ProducerMessage{Topic: key, Value: sarama.ByteEncoder(value)}
	_, _, err := s.producer.SendMessage(msg)
	if err != nil {
		return errors.Wrap(err, "kafka failed to put "+key)
	}
	// log.Printf("wrote topic %s partition %d offset %d", key, partition, offset)
	return nil
}
