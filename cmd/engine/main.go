package main

import (
	"github.com/SpaceHexagon/convolvr/services/engine"
	"github.com/spf13/viper"
)

func main() {
	viper.BindEnv("ssl")
	viper.BindEnv("port")
	viper.BindEnv("tls_port")
	viper.BindEnv("certificate")
	viper.BindEnv("key")
	viper.BindEnv("kafka_addr")
	viper.BindEnv("web_path")

	svc := engine.NewService(engine.ServiceConfig{
		SSL:         viper.GetBool("ssl"),
		Port:        viper.GetString("port"),
		TLSPort:     viper.GetString("tls_port"),
		Certificate: viper.GetString("certificate"),
		Key:         viper.GetString("key"),
		KafkaAddr:   viper.GetString("kafka_addr"),
		WWW:         viper.GetString("web_path"),
	})

	svc.Start()
}
