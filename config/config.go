/* config */
package config

type Configuration struct {
    SSL bool
    Port        string
	TLSPort     string
	Key         string
	Certificate string
}

func GetConfig () Configuration {
    data := Configuration{
        SSL: false,
        Port:        ":2000",
		TLSPort:     ":443",
		Key:         "",
		Certificate: "",
    }
    return data
}
