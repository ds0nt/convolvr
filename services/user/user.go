package auth

type User struct {
	Id   string
	Name string
}

type UserService interface {
	GetUser(id string) (*User, error)
	UpdateUser(*User) error
	DeleteUser(*User) error
	CreateUser() (*User, error)
}
