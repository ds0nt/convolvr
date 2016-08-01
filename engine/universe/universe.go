package universe

import (
	"sync"

	"github.com/SpaceHexagon/convolvr/engine/entities"
)

type Universe struct {
	entityMutex  sync.Mutex
	entities     []*entities.Entity
	entitiesById map[string]*entities.Entity
}

func NewUniverse() *Universe {
	return &Universe{
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
	// do updates

	// random things!

	// stuffs!

	// update ai

	// server-side physics

	// etc.

	// update by universe rules
}
