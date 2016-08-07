package entities

import (
	"fmt"
	"github.com/SpaceHexagon/convolvr/engine/components"
	"github.com/SpaceHexagon/convolvr/engine/types"
)

type Player struct {
	Entity      *Entity
	Username    string
	LeftArm     *Arm
	RightArm    *Arm
	Image       string
	ImageWidth  int
	ImageHeight int
}

var playerCount = 0

func NewPlayer() *Player {
	playerCount++
	return &Player{
		//Entity:   NewEntity([]string{"aspect_test"},[]*components.Component{*components.NewComponent("stucture", "box", []int{100,100,100}, 0xffffff, "default", &types.Position{}, &types.Quaternion{})}),
		Entity: NewEntity([]*components.Component{}, []*types.Aspect{}),
		Username: fmt.Sprintf("Player%d", playerCount),
		LeftArm:  NewArm(),
		RightArm: NewArm(),
	}
}

type Arm struct {
	Entity *Entity
}

func NewArm() *Arm {
	return &Arm{
		Entity: NewEntity([]*components.Component{}, []*types.Aspect{}),
	}
}
