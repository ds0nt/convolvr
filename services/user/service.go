package user

import "fmt"

type UserService struct {
	config UserServiceConfig
	done   chan struct{}
}

type UserServiceConfig struct {
	SSL         bool
	TLS         string
	Port        string
	Certificate string
	Key         string
}

func NewUserService(config UserServiceConfig) *UserService {
	return UserService{
		done:   make(chan struct{}),
		config: config,
	}
}

func (svc *UserService) Stop() {
	svc.done <- struct{}{}
}

func (svc *UserService) Start() {
	svc.start()
	<-svc.done
	fmt.Println("Exiting")
}

func (svc *UserService) start() {

}
