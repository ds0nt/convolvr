package user

import (
	"encoding/json"
	"fmt"
	"net"

	log "github.com/Sirupsen/logrus"

	"golang.org/x/net/context"

	"google.golang.org/grpc"

	"github.com/pborman/uuid"
	"github.com/pkg/errors"
	lediscfg "github.com/siddontang/ledisdb/config"
	"github.com/siddontang/ledisdb/ledis"
)

type Service struct {
	UserServiceServer
	config ServiceConfig
	done   chan struct{}
	db     *ledis.DB
}

type ServiceConfig struct {
	GRPCPort string
}

func NewService(config ServiceConfig) *Service {
	// Use Ledis's default config
	cfg := lediscfg.NewConfigDefault()
	l, _ := ledis.Open(cfg)
	db, _ := l.Select(0)

	return &Service{
		done:   make(chan struct{}),
		config: config,
		db:     db,
	}
}

func (svc *Service) Stop() {
	svc.done <- struct{}{}
}

func (svc *Service) Start() {
	svc.start()
	<-svc.done
	fmt.Println("Exiting")
}

func (svc *Service) start() {
	lis, err := net.Listen("tcp", svc.config.GRPCPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	RegisterUserServiceServer(s, svc)
	s.Serve(lis)
}

func (s *Service) GetUser(c context.Context, r *GetUserRequest) (*GetUserResponse, error) {
	log.WithField("rpc", "GetUser").WithField("id", r.Id).Println("called")
	data, err := s.db.Get([]byte(r.Id))
	if err != nil {
		return nil, err
	}
	u, err := deserialize(data)
	if err != nil {
		return nil, err
	}
	return &GetUserResponse{User: u}, nil
}

func (s *Service) UpdateUser(c context.Context, r *UpdateUserRequest) (*UpdateUserResponse, error) {
	log.WithField("rpc", "UpdateUser").WithField("id", r.User.Id).Println("called")
	_, err := saveUser(s.db, r.User)
	if err != nil {
		return nil, err
	}
	return &UpdateUserResponse{}, nil
}

func (s *Service) DeleteUser(c context.Context, r *DeleteUserRequest) (*DeleteUserResponse, error) {
	log.WithField("rpc", "DeleteUser").WithField("id", r.Id).Println("called")
	_, err := s.db.Del([]byte(r.Id))
	if err != nil {
		return nil, err
	}
	return &DeleteUserResponse{}, nil
}

func (s *Service) CreateUser(c context.Context, r *CreateUserRequest) (*CreateUserResponse, error) {
	log.WithField("rpc", "CreateUser").WithField("email", r.User.Email).Println("called")
	r.User.Id = uuid.NewUUID().String()
	u, err := saveUser(s.db, r.User)
	if err != nil {
		return nil, err
	}
	return &CreateUserResponse{Id: u.Id}, nil
}

func saveUser(db *ledis.DB, u *User) (*User, error) {
	data, err := serialize(u)
	if err != nil {
		return nil, err
	}
	err = db.Set([]byte(u.Id), data)
	if err != nil {
		return nil, err
	}
	return u, nil
}

func serialize(u *User) ([]byte, error) {
	data, err := json.Marshal(u)
	if err != nil {
		return nil, errors.Wrap(err, "serialize user error")
	}
	return data, nil
}

func deserialize(data []byte) (*User, error) {
	u := User{}
	err := json.Unmarshal(data, &u)
	if err != nil {
		return nil, errors.Wrapf(err, "could not deserialize user %s", string(data))
	}
	return &u, nil
}
