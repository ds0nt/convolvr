package main

import (
	"github.com/SpaceHexagon/convolvr/services/user"
	"github.com/spf13/viper"
)

func main() {
	viper.BindEnv("grpc_port")

	svc := user.NewService(user.ServiceConfig{
		GRPCPort: viper.GetString("grpc_port"),
	})

	svc.Start()
}
