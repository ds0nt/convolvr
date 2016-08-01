package universe

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/Shopify/sarama"
	"github.com/SpaceHexagon/convolvr/engine/entities"
	"github.com/pkg/errors"
)

type UniverseStore interface {
	Put(key string, value []byte) error
	Listen(key string) (chan []byte, chan error)
	Close()
}

type Universe struct {
	store        UniverseStore
	entityMutex  sync.Mutex
	entities     []*entities.Entity
	entitiesById map[string]*entities.Entity
}

func NewUniverse(store UniverseStore) *Universe {
	log.Println("Creating Universe")

	return &Universe{
		store:        store,
		entityMutex:  sync.Mutex{},
		entities:     []*entities.Entity{},
		entitiesById: make(map[string]*entities.Entity),
	}
}

func (u *Universe) listenEntity(id string) {
	u.entityMutex.Lock()
	e, ok := u.entitiesById[id]
	if !ok {
		e = entities.NewEntity()
		u.entities = append(u.entities, e)
		u.entitiesById[id] = e
	}
	u.entityMutex.Unlock()

	entityUpdateCh, entityUpdateErrs := u.store.Listen("entity-" + id)
	for {
		select {
		case data := <-entityUpdateCh:
			log.Println("data", string(data))
			updatedEntity := entities.Entity{}
			err := json.Unmarshal(data, &updatedEntity)
			if err != nil {
				log.Println("updatedEntity unmarshal err", err)
			}
			e.Update(updatedEntity.Position, updatedEntity.Quaternion)
			log.Println("Loaded Entity Update", string(data))
		case err := <-entityUpdateErrs:
			log.Println("entityUpdateErrs err", err)
		}
	}
}

func (u *Universe) Start() {
	entityCh, entityErrs := u.store.Listen("entities")

	go func() {
		for e := range entityCh {
			id := string(e)
			log.Println("entity", id)
			// we got a new entity!
			go u.listenEntity(id)
		}
	}()
	go func() {
		for err := range entityErrs {
			log.Println("entityErrs err", err)
		}
	}()
	log.Println("Universe Started")

	t := time.NewTicker(time.Second / 30)
	for range t.C {
		u.Tick()
	}
}

func (u *Universe) AddEntity(e *entities.Entity) {
	data, err := json.Marshal(e)
	if err != nil {
		log.Println("AddEntity json marshal", err)
	}
	err = u.store.Put("entity-"+e.Id, data)
	if err != nil {
		log.Println("AddEntity entity", err)
	}
	err = u.store.Put("entities", []byte(e.Id))
	if err != nil {
		log.Println("AddEntity entities", err)
	}
}

func (u *Universe) Tick() {
	log.Println("Tick")
	for _, entity := range u.entities {
		data, _ := json.Marshal(entity)
		u.store.Put("entity-"+entity.Id, data)
	}
	// do updates

	// random things!

	// stuffs!

	// update ai

	// server-side physics

	// etc.

	// update by universe rules
}

type KafkaStore struct {
	producer sarama.SyncProducer
	consumer sarama.Consumer
}

func NewKafkaStore(addrs []string) *KafkaStore {
	producer, err := sarama.NewSyncProducer(addrs, nil)
	if err != nil {
		panic(err)
	}
	consumer, err := sarama.NewConsumer(addrs, nil)
	if err != nil {
		panic(err)
	}
	return &KafkaStore{
		producer: producer,
		consumer: consumer,
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
	partition, offset, err := s.producer.SendMessage(msg)
	if err != nil {
		return errors.Wrap(err, "kafka failed to put "+key)
	}
	log.Printf("wrote topic %s partition %d offset %d", key, partition, offset)
	return nil
}
