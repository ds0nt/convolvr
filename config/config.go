/* config */
package config

type Configuration struct {
    SSL bool
    Port string
    Key string
    Certificate string
}

func GetConfig () Configuration {
    data := Configuration{
        SSL: false,
        Port: ":443",
        Key: "",
        Certificate: "",
    }
    return data
}
