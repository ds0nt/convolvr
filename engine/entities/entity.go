package entities

import (
	"github.com/SpaceHexagon/convolvr/engine/types"
	"github.com/pborman/uuid"
)

type Entity struct {
	Id         string            `json:"id"`
	Aspects    []string 		 `json:"aspects"`
	Position   *types.Position   `json:"pos"`
	Quaternion *types.Quaternion `json:"quat"`
}

func NewEntity() *Entity {
	return &Entity{
		Id:         uuid.NewUUID().String(),
		Aspects:	[]string,
		Position:   &types.Position{},
		Quaternion: &types.Quaternion{},
	}
}

func (e *Entity) Update(p *types.Position, q *types.Quaternion) {
	e.Position.X = p.X
	e.Position.Y = p.Y
	e.Position.Z = p.Z
	e.Quaternion.X = q.X
	e.Quaternion.Y = q.Y
	e.Quaternion.Z = q.Z
	e.Quaternion.W = q.W
}
