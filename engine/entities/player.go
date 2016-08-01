package entities

import "fmt"

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
		Entity:   NewEntity(),
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
		Entity: NewEntity(),
	}
}
