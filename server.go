package main

import (
	"fmt"

	//"gopkg.in/redis.v3"
	//"github.com/ant0ine/go-json-rest/rest"
	"github.com/SpaceHexagon/convolvr/api"
	config "github.com/SpaceHexagon/convolvr/config"
)

func main() {
	done := make(chan struct{})
	settings := config.GetConfig()

	go func() {
		defer close(done)
		var port = settings.Port
		if (settings.SSL) {
			port = settings.TLSPort
		}
		api.Serve(port, settings.Certificate, settings.Key)	
	}()

	// client := redis.NewClient(&redis.Options{
	// 	Addr:     "localhost:6379",
	// 	Password: "",
	// 	DB:       0,
	// })
	// pong, err := client.Ping().Result()
	// fmt.Println(pong, err)

	<-done
	fmt.Println("Exiting")
}
