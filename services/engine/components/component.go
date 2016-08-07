package components

import (
	"github.com/SpaceHexagon/convolvr/services/engine/types"
	"github.com/pborman/uuid"
)

type Component struct {
	Id            string            `json:"id"`
	ComponentType string            `json:"type"`
	Shape         string            `json:"shape"`
	Size          []int             `json:"size"`
	Color         int               `json:"color"`
	Material      string            `json:"mat"`
	Position      *types.Position   `json:"pos"`
	Quaternion    *types.Quaternion `json:"quat"`
}

func NewComponent(componentType string, shape string, size []int, color int, material string, p *types.Position, q *types.Quaternion) *Component {
	return &Component{
		Id:            uuid.NewUUID().String(),
		ComponentType: componentType,
		Shape:         shape,
		Size:          size,
		Color:         color,
		Material:      material,
		Position:      &types.Position{X: p.X, Y: p.Y, Z: p.Z},
		Quaternion:    &types.Quaternion{X: q.X, Y: q.Y, Z: q.Z, W: q.W},
	}
}

func (e *Component) Update(p *types.Position, q *types.Quaternion) {
	e.Position.X = p.X
	e.Position.Y = p.Y
	e.Position.Z = p.Z
	e.Quaternion.X = q.X
	e.Quaternion.Y = q.Y
	e.Quaternion.Z = q.Z
	e.Quaternion.W = q.W
}
