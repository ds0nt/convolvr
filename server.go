package main

import (
	"io"
	"log"
	"fmt"
	"strings"
	"net/http"
	"gopkg.in/redis.v3"
	"github.com/googollee/go-socket.io"

)

func initSockets () (*socketio.Server) {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On("connection", func(so socketio.Socket) {
		log.Println("on connection")
		so.Join("chat")
		so.On("chat message", func(msg string) {
			log.Println("emit:", so.Emit("chat message", msg))
			so.BroadcastTo("chat", "chat message", msg)
		})
		so.On("disconnection", func() {
			log.Println("on disconnect")
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})
	return server;
}


func main() {
	http.Handle("/", http.FileServer(http.Dir("./web")))
	http.HandleFunc("/api/users", handleUsers)
	http.HandleFunc("/api/avatars", handleAvatars)
	http.HandleFunc("/api/platforms", handlePlatforms )
	http.HandleFunc("/api/tracks", handleTracks )
	http.HandleFunc("/api/groups", handleGroups )
	http.HandleFunc("/api/friends", handleFriends)
	http.HandleFunc("/api/components", handleComponents)
	http.HandleFunc("/api/entities", handleEntities)
	http.HandleFunc("/api/tools", handleTools)
	http.HandleFunc("/api/patterns", handlePatterns)
	http.HandleFunc("/api/pages", handlePages)
	http.HandleFunc("/api/files", handleFiles)
	http.HandleFunc("/api/messages", handleMessages)

	err := http.ListenAndServe(":3600", nil)
	//err := http.ListenAndServeTLS(":443", "server.crt", "server.key", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	} else {
		log.Println("Battlecruiser Operational! port: 3600")
	}

	client := redis.NewClient(&redis.Options{
			Addr:     "localhost:6379",
			Password: "",
			DB:       0,
	})
	pong, err := client.Ping().Result()
	fmt.Println(pong, err)

	http.Handle("/socket.io/", initSockets())
}

func handleUsers (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handleAvatars (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handlePlatforms (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handleTracks (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handleGroups (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handleFriends (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handleComponents (w http.ResponseWriter, r *http.Request) {
	r.ParseForm()  // parse arguments, you have to call this by yourself
	 fmt.Println(r.Form)  // print form information in server side
	 fmt.Println("path", r.URL.Path)
	 fmt.Println("scheme", r.URL.Scheme)
	 fmt.Println(r.Form["url_long"])
	 for k, v := range r.Form {
			 fmt.Println("key:", k)
			 fmt.Println("val:", strings.Join(v, ""))
	 }
	 fmt.Fprintf(w, "{}")// send data to client side
}

func handleEntities (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handleTools (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handlePatterns (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handlePages (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handleFiles (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
}

func handleMessages (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{}")
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
