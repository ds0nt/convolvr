package auth

import (
	"encoding/json"

	"github.com/pborman/uuid"
	"github.com/pkg/errors"
	lediscfg "github.com/siddontang/ledisdb/config"
	"github.com/siddontang/ledisdb/ledis"
)

type ledisAuth struct {
	db    *ledis.DB
	ledis *ledis.Ledis
	cfg   *lediscfg.Config
}

func newService() *ledisAuth {

	// Use Ledis's default config
	cfg := lediscfg.NewConfigDefault()
	l, _ := ledis.Open(cfg)
	db, _ := l.Select(0)
	return &ledisAuth{
		db:    db,
		ledis: l,
		cfg:   cfg,
	}
}

func (s *ledisAuth) GetUser(id string) (*User, error) {
	data, err := s.db.Get([]byte(id))
	if err != nil {
		return nil, err
	}
	u, err := deserialize(data)
	if err != nil {
		return nil, err
	}
	return u, nil
}

func (s *ledisAuth) UpdateUser(u *User) error {
	_, err := saveUser(s.db, u)
	return err
}

func (s *ledisAuth) DeleteUser(u *User) error {
	_, err := s.db.Del([]byte(u.Id))
	return err
}

func (s *ledisAuth) CreateUser(u *User) (*User, error) {
	u.Id = uuid.NewUUID().String()
	u, err := saveUser(s.db, u)
	return u, err
}

func saveUser(db *ledis.DB, u *User) (*User, error) {
	data, err := serialize(u)
	if err != nil {
		return nil, err
	}
	err = db.Set([]byte(u.Id), data)
	if err != nil {
		return nil, err
	}
	return u, nil
}

func serialize(u *User) ([]byte, error) {
	data, err := json.Marshal(u)
	if err != nil {
		return nil, errors.Wrap(err, "serialize user error")
	}
	return data, nil
}

func deserialize(data []byte) (*User, error) {
	u := User{}
	err := json.Unmarshal(data, &u)
	if err != nil {
		return nil, errors.Wrapf(err, "could not deserialize user %s", string(data))
	}
	return &u, nil
}
