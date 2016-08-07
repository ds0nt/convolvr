package engine

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/SpaceHexagon/convolvr/services/user"
	"google.golang.org/grpc"
)

//"gopkg.in/redis.v3"
//"github.com/ant0ine/go-json-rest/rest"

// Service is the main game engine service
type Service struct {
	config     ServiceConfig
	done       chan struct{}
	userClient user.UserServiceClient
}

// ServiceConfig is the start configuration for the engine service
type ServiceConfig struct {
	SSL         bool
	Port        string
	TLSPort     string
	Certificate string
	Key         string
	KafkaAddr   string
	UserAddr    string
	WWW         string
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
	// Set up a connection to the server.
	userConn, err := grpc.Dial(svc.config.UserAddr, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer userConn.Close()
	svc.userClient = user.NewUserServiceClient(userConn)

	go startUpdater()

	http.Handle("/", http.FileServer(http.Dir(svc.config.WWW)))
	http.HandleFunc("/api/users", handleUsers)
	http.HandleFunc("/api/avatars", handleAvatars)
	http.HandleFunc("/api/platforms", handlePlatforms)
	http.HandleFunc("/api/tracks", handleTracks)
	http.HandleFunc("/api/groups", handleGroups)
	http.HandleFunc("/api/friends", handleFriends)
	http.HandleFunc("/api/components", handleComponents)
	http.HandleFunc("/api/entities", handleEntities)
	http.HandleFunc("/api/tools", handleTools)
	http.HandleFunc("/api/patterns", handlePatterns)
	http.HandleFunc("/api/pages", handlePages)
	http.HandleFunc("/api/files", handleFiles)
	http.HandleFunc("/api/messages", handleMessages)

	http.Handle("/connect", svc.makeWebSocketAPI())

	if svc.config.SSL {
		log.Fatal("ListenAndServe", http.ListenAndServeTLS(svc.config.TLSPort, svc.config.Certificate, svc.config.Key, nil))
	} else {
		log.Fatal("ListenAndServe", http.ListenAndServe(svc.config.Port, nil))
	}
}

func handleUsers(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Println(r.Form)
	fmt.Println("path", r.URL.Path)
	fmt.Println("scheme", r.URL.Scheme)
	io.WriteString(w, "{users:[]}")
}

func handleAvatars(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{avatars:[]}")
}

func handlePlatforms(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Println(r.Form)
	fmt.Println("path", r.URL.Path)
	fmt.Println("scheme", r.URL.Scheme)
	io.WriteString(w, "{platforms:[]}")
}

func handleTracks(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{tracks:[]}")
}

func handleGroups(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{groups:[]}")
}

func handleFriends(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{friends:[]}")
}

func handleComponents(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Println(r.Form)
	fmt.Println("path", r.URL.Path)
	fmt.Println("scheme", r.URL.Scheme)
	fmt.Println(r.Form["url_long"])
	for k, v := range r.Form {
		fmt.Println("key:", k)
		fmt.Println("val:", strings.Join(v, ""))
	}
	fmt.Fprintf(w, "{}") // send data to client side
}

func handleEntities(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{entities:[]}")
}

func handleTools(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{tools:[]}")
}

func handlePatterns(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{patterns:[]}")
}

func handlePages(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{pages:[]}")
}

func handleFiles(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{files:[]}")
}

func handleMessages(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{messages:[]}")
}

// func ExampleClient() {
//     err := client.Set("key", "value", 0).Err()
//     if err != nil {
//         panic(err)
//     }
//     val, err := client.Get("key").Result()
//     if err != nil {
//         panic(err)
//     }
//     fmt.Println("key", val)
//     val2, err := client.Get("key2").Result()
//     if err == redis.Nil {
//         fmt.Println("key2 does not exists")
//     } else if err != nil {
//         panic(err)
//     } else {
//         fmt.Println("key2", val2)
//     }
// }
