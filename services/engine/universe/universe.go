package universe

import (
	"encoding/json"
	"log"
	"sync"
	"time"
<<<<<<< HEAD:services/engine/universe/universe.go

	"github.com/SpaceHexagon/convolvr/services/engine/entities"
=======
	"github.com/Shopify/sarama"
	"github.com/SpaceHexagon/convolvr/engine/entities"
	"github.com/SpaceHexagon/convolvr/engine/components"
	"github.com/SpaceHexagon/convolvr/engine/types"
	"github.com/pkg/errors"
>>>>>>> 803cbe5b4789d816bdcc1d2f426bd22b910bcfe9:engine/universe/universe.go
)

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
		e = entities.NewEntity([]*components.Component{}, []*types.Aspect{})
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
	t2 := time.Now()
	for t := range t.C {
		log.Println("sleep", t.Sub(t2))
		u.Tick()
		t2 = time.Now()
		log.Println("process", t2.Sub(t))
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
	g := sync.WaitGroup{}
	g.Add(len(u.entities))
	for k := range u.entities {
		go func(k int) {
			data, _ := json.Marshal(u.entities[k])
			u.store.Put("entity-"+u.entities[k].Id, data)
			g.Done()
		}(k)
	}
	g.Wait()
	// do updates

	// random things!

	// stuffs!

	// update ai

	// server-side physics

	// etc.

	// update by universe rules
}
