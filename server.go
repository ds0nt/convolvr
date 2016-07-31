package main

import (
	"io"
	"log"
	"fmt"
	"strings"
	"net/http"
	"gopkg.in/redis.v3"
	"github.com/googollee/go-socket.io"
	//"github.com/ant0ine/go-json-rest/rest"
	config "github.com/SpaceHexagon/convolvr/config"
)



func main() {
	settings := config.GetConfig()
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

	socketServer, socketErr := socketio.NewServer(nil)
	if socketErr != nil {
		log.Fatal(socketErr)
	}
	socketServer.On("connection", func(so socketio.Socket) {
		log.Println("User Joined")
		so.Join("chat")
		so.On("chat:message", func(msg string) {
			log.Println("emit:", so.Emit("chat:message", msg))
			so.BroadcastTo("chat", "chat:message", msg)
		})
		so.On("disconnection", func() {
			log.Println("User Quit")
		})
	})
	socketServer.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})
	http.Handle("/socket.io/", socketServer)

	if (settings.SSL) {
		httpsErr := http.ListenAndServeTLS(settings.Port, settings.Certificate, settings.Key, nil)
		if httpsErr != nil {
			log.Fatal("ListenAndServe: ", httpsErr)
		}
	} else {
		httpErr := http.ListenAndServe(":3080", nil)
		if httpErr != nil {
			log.Fatal("ListenAndServe: ", httpErr)
		}
	}



	client := redis.NewClient(&redis.Options{
			Addr:     "localhost:6379",
			Password: "",
			DB:       0,
	})
	pong, dbErr := client.Ping().Result()
	fmt.Println(pong, dbErr)
}

func handleUsers (w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Println(r.Form)
	fmt.Println("path", r.URL.Path)
 	fmt.Println("scheme", r.URL.Scheme)
	io.WriteString(w, "{users:[]}")
}

func handleAvatars (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{avatars:[]}")
}

func handlePlatforms (w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Println(r.Form)
	fmt.Println("path", r.URL.Path)
	fmt.Println("scheme", r.URL.Scheme)
	io.WriteString(w, "{platforms:[]}")
}

func handleTracks (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{tracks:[]}")
}

func handleGroups (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{groups:[]}")
}

func handleFriends (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{friends:[]}")
}

func handleComponents (w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	 fmt.Println(r.Form)
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
	io.WriteString(w, "{entities:[]}")
}

func handleTools (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{tools:[]}")
}

func handlePatterns (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{patterns:[]}")
}

func handlePages (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{pages:[]}")
}

func handleFiles (w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "{files:[]}")
}

func handleMessages (w http.ResponseWriter, r *http.Request) {
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
