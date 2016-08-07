package engine

import (
	"fmt"
	"log"
	"net/http"

	//"gopkg.in/redis.v3"
	//"github.com/ant0ine/go-json-rest/rest"
)

// Service is the main game engine service
type Service struct {
	config ServiceConfig
	done   chan struct{}
}

// ServiceConfig is the start configuration for the engine service
type ServiceConfig struct {
	SSL         bool
	Port        string
	TLSPort     string
	Certificate string
	Key         string
	KafkaAddr   string
}

// NewService creates a new Service
func NewService(config ServiceConfig) *Service {
	return &Service{
		done:   make(chan struct{}),
		config: config,
	}
}

// Stop stops the service
func (svc *Service) Stop() {
	svc.done <- struct{}{}
}

// Start starts the engine service
func (svc *Service) Start() {
	svc.start()
	<-svc.done
	fmt.Println("Exiting")
}

func (svc *Service) start() {
	go startUpdater()

	http.Handle("/connect", svc.makeWebSocketAPI())

	if svc.config.SSL {
		log.Fatal("ListenAndServe", http.ListenAndServeTLS(svc.config.TLSPort, svc.config.Certificate, svc.config.Key, nil))
	} else {
		log.Fatal("ListenAndServe", http.ListenAndServe(svc.config.Port, nil))
	}
}
