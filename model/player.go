package model

import (
	"appengine"
	"appengine/datastore"
	"log"
)

type Player struct {
	Name string
	Email string
	Faction string
}

func playerKey(c appengine.Context, s *Season, email string) *datastore.Key {
	var sKey *datastore.Key
	sKey = nil
	if s != nil {
		sKey = seasonKey(c, s.Name, s.Year)
	}
	return datastore.NewKey(c, "Player", email, 0, sKey)
}

func SavePlayer(c appengine.Context, s *Season, name string, email string, faction string) error {
	p := Player {
		Name: name,
		Email: email,
		Faction: faction,
	}
	key := playerKey(c, s, email)
	_, err := datastore.Put(c, key, &p)
	return err
}

func LoadPlayer(c appengine.Context, s *Season, email string) *Player {
	key := playerKey(c, s, email)
	var p Player
	err := datastore.Get(c, key, &p)
	if err == datastore.ErrNoSuchEntity {
		return nil
	} else if err != nil {
		log.Printf("Got an unexpected error looking up a season: %v", err)
	}
	return &p
}
