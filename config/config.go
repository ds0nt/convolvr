/* config */
package config

type Configuration struct {
	Port        string
	TLSPort     string
	Key         string
	Certificate string
}

func GetConfig() Configuration {
	data := Configuration{
		Port:        ":2000",
		TLSPort:     ":443",
		Key:         "",
		Certificate: "",
	}
	return data
}
