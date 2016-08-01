package universe

import (
	"log"
	"sync"

	"github.com/Shopify/sarama"
	"github.com/SpaceHexagon/convolvr/engine/entities"
	"github.com/pkg/errors"
)

type UniverseStore interface {
	Put(key string, value []byte) error
	Close()
}

type Universe struct {
	store        UniverseStore
	entityMutex  sync.Mutex
	entities     []*entities.Entity
	entitiesById map[string]*entities.Entity
}

func NewUniverse(store UniverseStore) *Universe {
	return &Universe{
		store:        store,
		entityMutex:  sync.Mutex{},
		entities:     []*entities.Entity{},
		entitiesById: make(map[string]*entities.Entity),
	}
}

func (u *Universe) AddEntity(e *entities.Entity) {
	u.entityMutex.Lock()
	defer u.entityMutex.Unlock()
	u.entities = append(u.entities, e)
	u.entitiesById[e.Id] = e
}

func (u *Universe) Tick() {
	u.store.Put("a", []byte("b"))
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
}

func NewKafkaStore(addrs []string) *KafkaStore {
	producer, err := sarama.NewSyncProducer(addrs, nil)
	if err != nil {
		panic(err)
	}

	return &KafkaStore{
		producer: producer,
	}
}

func (s *KafkaStore) Close() {
	s.producer.Close()
}

func (s *KafkaStore) Put(key string, value []byte) error {
	msg := &sarama.ProducerMessage{Topic: key, Value: sarama.StringEncoder(value)}
	partition, offset, err := s.producer.SendMessage(msg)
	if err != nil {
		return errors.Wrap(err, "kafka failed to put "+key)
	}
	log.Printf("wrote topic %s partition %d offset %d", key, partition, offset)
	return nil
}
