package api

import (
	"os"
	"sync"
	"time"

	"golang.org/x/net/websocket"

	"github.com/SpaceHexagon/convolvr/engine/entities"
	"github.com/SpaceHexagon/convolvr/engine/types"
	univs "github.com/SpaceHexagon/convolvr/engine/universe"
	"github.com/SpaceHexagon/convolvr/socket"
	"github.com/pkg/errors"
)

var universe *univs.Universe

func makeWebSocketAPI() websocket.Handler {

	universeStore := univs.NewKafkaStore([]string{os.Getenv("KAFKA_ADDR")})
	universe = univs.NewUniverse(universeStore)
	go universe.Start()

	server := socket.NewServer()
	server.HandleConnect(onClientConnect)
	server.HandleDisconnect(onClientDisconnect)
	server.Handle("/update", onClientUpdate)

	return websocket.Handler(server.Server)
}

var clientPlayers = make(map[*socket.Client]*entities.Player)
var clientPlayerMutex = sync.Mutex{}

func broadcast(msg *socket.BaseMessage) {
	for c := range clientPlayers {
		go c.Send(msg)
	}
}

func startUpdater() {
	go func() {
		var ticker = time.NewTicker(time.Second / 30)
		for {
			<-ticker.C
			for _, p := range clientPlayers {
				msg, _ := socket.NewBaseMessage("/update", &pushEntityUpdate{
					Entity: p.Entity,
				})
				broadcast(msg)
				msg, _ = socket.NewBaseMessage("/update", &pushEntityUpdate{
					Entity: p.LeftArm.Entity,
				})
				broadcast(msg)
				msg, _ = socket.NewBaseMessage("/update", &pushEntityUpdate{
					Entity: p.RightArm.Entity,
				})
				broadcast(msg)
			}
		}
	}()
}

func onClientConnect(c *socket.Client) {
	clientPlayerMutex.Lock()
	defer clientPlayerMutex.Unlock()
	player := entities.NewPlayer()
	clientPlayers[c] = player
	universe.AddEntity(player.Entity)
}

func onClientDisconnect(c *socket.Client) {
	clientPlayerMutex.Lock()
	defer clientPlayerMutex.Unlock()
	delete(clientPlayers, c)
}

func onClientUpdate(r *socket.Request, c *socket.Client) {
	params := updateData{}
	err := r.Decode(&params)
	if err != nil {
		c.SendError(errors.Errorf("invalid params %s", string(r.Data)))
		return
	}

	p := clientPlayers[c]
	p.Entity.Update(params.Position, params.Quaternion)

	if len(params.Arms) == 2 {
		p.LeftArm.Entity.Update(params.Arms[0].Position, params.Arms[0].Quaternion)
		p.RightArm.Entity.Update(params.Arms[1].Position, params.Arms[1].Quaternion)
	}

	// log.Println(params.Position.X, params.Position.Y, params.Position.Z)
}

type pushEntityUpdate struct {
	Entity *entities.Entity `json:"entity"`
}

type updateData struct {
	Username   string            `json:"username"`
	Image      string            `json:"image"`
	ImageSize  []int             `json:"imageSize"`
	Arms       []entities.Entity `json:"arms"`
	Position   *types.Position   `json:"position"`
	Quaternion *types.Quaternion `json:"quaternion"`
}
