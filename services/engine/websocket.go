package engine

import (
	"sync"
	"time"

	log "github.com/Sirupsen/logrus"
	"golang.org/x/net/context"
	"golang.org/x/net/websocket"

	"github.com/SpaceHexagon/convolvr/pkg/socket"
	"github.com/SpaceHexagon/convolvr/services/engine/entities"
	"github.com/SpaceHexagon/convolvr/services/engine/types"
	univs "github.com/SpaceHexagon/convolvr/services/engine/universe"
	"github.com/SpaceHexagon/convolvr/services/user"
	"github.com/pkg/errors"
)

var universe *univs.Universe

func (svc *Service) makeWebSocketAPI() websocket.Handler {

	universeStore := univs.NewKafkaStore([]string{svc.config.KafkaAddr})
	universe = univs.NewUniverse(universeStore)
	go universe.Start()

	server := socket.NewServer()
	server.HandleConnect(onClientConnect)
	server.HandleDisconnect(onClientDisconnect)
	server.Handle("/update", svc.onClientUpdate)
	server.Handle("/user/create", svc.onClientUserCreate)
	// server.Handle("/user/read", onUserRead)
	// server.Handle("/user/update", onUserUpdate)

	return websocket.Handler(server.Server)
}

var clientPlayers = make(map[*socket.Client]*entities.Player)
var clientPlayerMutex = sync.Mutex{}

func broadcast(msg *socket.BaseMessage) {
	for c := range clientPlayers {
		go c.Send(msg)
	}
}

type pushEntityUpdate struct {
	Entity *entities.Entity `json:"entity"`
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

type updateData struct {
	Username   string            `json:"username"`
	Image      string            `json:"image"`
	ImageSize  []int             `json:"imageSize"`
	Arms       []entities.Entity `json:"arms"`
	Position   *types.Position   `json:"position"`
	Quaternion *types.Quaternion `json:"quaternion"`
}

func (svc Service) onClientUpdate(r *socket.Request, c *socket.Client) {
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

}

type userCreateData struct {
	RequestId string `json:"request_id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type userCreateResponse struct {
	RequestId string
	Id        string
}

func (svc Service) onClientUserCreate(r *socket.Request, c *socket.Client) {
	log.WithField("handler", "onClientUserCreate").Println("called")

	params := userCreateData{}
	err := r.Decode(&params)
	if err != nil {
		c.SendError(errors.Errorf("invalid params %s", string(r.Data)))
		return
	}

	res, err := svc.userClient.CreateUser(context.Background(), &user.CreateUserRequest{
		User: &user.User{
			Username: params.Username,
			Email:    params.Email,
		},
		Password: params.Password,
	})
	if err != nil {
		log.Printf("Could not create user: %v", err)
	}
	msg, _ := socket.NewBaseMessage("/user/create", &userCreateResponse{
		RequestId: params.RequestId,
		Id:        res.Id,
	})
	c.Send(msg)
}
