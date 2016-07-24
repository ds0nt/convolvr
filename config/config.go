/* config */
package config

type Configuration struct {
    Port string
    Key string
    Certificate string
}

func GetConfig () Configuration {
    data := Configuration{
        Port: ":443",
        Key: "",
        Certificate: "",
    }
    return data
}
