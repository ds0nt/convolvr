package socket

import (
	"encoding/json"
	"sync"

	log "github.com/Sirupsen/logrus"
	"github.com/pkg/errors"

	"golang.org/x/net/websocket"
)

type Server struct {
	sync.Mutex
	handlers map[string]Handler
}

func NewServer() *Server {
	u := &Server{
		handlers: make(map[string]Handler),
	}
	return u
}

type Handler func(r *Request, client *Client)

func (u *Server) Handle(path string, handler Handler) {
	u.Lock()
	defer u.Unlock()
	u.handlers[path] = handler
}

type BaseMessage struct {
	Path string `json:"p"`
	Data string `json:"d"`
}

func NewBaseMessage(path string, data interface{}) (*BaseMessage, error) {
	bs, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	return &BaseMessage{
		Path: path,
		Data: string(bs),
	}, nil
}

type Client struct {
	Out     chan *BaseMessage
	FatalCh chan error
	Conn    *websocket.Conn
}

func NewClient(ws *websocket.Conn) *Client {
	return &Client{
		Conn:    ws,
		Out:     make(chan *BaseMessage),
		FatalCh: make(chan error),
	}
}

func (c *Client) Send(msg *BaseMessage) {
	go func() {
		c.Out <- msg
	}()
}

func (c *Client) SendError(err error) {
	go func() {
		msg, _ := NewBaseMessage("/error", &ErrorMessage{Error: err.Error()})
		c.Out <- msg
	}()
}

func (c *Client) Fatal(err error) {
	go func() {
		c.FatalCh <- err
	}()
}

func (c *Client) Close() {
	c.Conn.Close()
	close(c.Out)
}

func (u *Server) Server(ws *websocket.Conn) {
	client := NewClient(ws)
	defer client.Close()
	errCh := make(chan error)
	defer close(errCh)

	go func() {
		for {
			var baseMsg BaseMessage
			err := websocket.JSON.Receive(ws, &baseMsg)
			if err != nil {
				errCh <- errors.Wrap(err, "WebSocket JSON Receive")
				return
			}
			fn, ok := u.handlers[baseMsg.Path]
			if !ok {
				log.Println("Handler not found", baseMsg.Path)
				continue
			}
			r := Request{
				Path: baseMsg.Path,
				Data: []byte(baseMsg.Data),
			}
			fn(&r, client)
			if err != nil {
				errCh <- errors.Wrapf(err, "%s handler returned error", baseMsg.Path)
				return
			}
		}
	}()

	for {
		select {
		case err := <-errCh:
			log.Println("close connection due to read error", err)
			return
		case outMsg := <-client.Out:
			if err := websocket.JSON.Send(ws, outMsg); err != nil {
				log.Println("close connection due to write error", err)
				return
			}
		case fatalMsg := <-client.FatalCh:
			log.Println("Fatal Message:", fatalMsg)
			if err := websocket.JSON.Send(ws, fatalMsg); err != nil {
				log.Println("close connection due to write error", err)
			}
			return
		}
	}
}

type ErrorMessage struct {
	Error string `json:"error"`
}

type Request struct {
	Path string
	Data []byte
}

func (r *Request) Decode(s interface{}) error {
	err := json.Unmarshal(r.Data, s)
	return err
}
