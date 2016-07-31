package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/kr/pretty"
	"github.com/pkg/errors"

	"golang.org/x/net/websocket"

	"gopkg.in/redis.v3"
	//"github.com/ant0ine/go-json-rest/rest"
	config "github.com/SpaceHexagon/convolvr/config"
	socket "github.com/SpaceHexagon/convolvr/socket"
)

func main() {
	done := make(chan struct{})
	settings := config.GetConfig()

	go func() {
		defer close(done)
		http.Handle("/", http.FileServer(http.Dir("./web")))
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

		server := socket.NewServer()
		server.Handle("/update", onClientUpdate)
		http.Handle("/connect", websocket.Handler(server.Server))

		log.Fatal("ListenAndServe", http.ListenAndServe(settings.Port, nil))
	}()

	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	pong, err := client.Ping().Result()
	fmt.Println(pong, err)

	<-done
	fmt.Println("Exiting")
}

type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

type Quaternion struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
	W float64 `json:"w"`
}

type Arms struct {
	Pos  *Position   `json:"pos"`
	Quat *Quaternion `json:"quat"`
}

type updateData struct {
	Username   string      `json:"username"`
	Image      string      `json:"image"`
	ImageSize  []int       `json:"imageSize"`
	Arms       []Arms      `json:"arms"`
	Position   *Position   `json:"position"`
	Quaternion *Quaternion `json:"quaternion"`
}

type updateResponseData struct {
	MOTD string
}

func onClientUpdate(r *socket.Request, c *socket.Client) {
	params := updateData{}
	err := r.Decode(&params)
	if err != nil {
		c.SendError(errors.Errorf("invalid params %s", string(r.Data)))
		return
	}

	pretty.Print(params)
	msg, _ := socket.NewBaseMessage("/update", &updateResponseData{MOTD: "Welcome to Convolvr!"})
	c.Send(msg)
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
