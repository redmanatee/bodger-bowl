package model

import (
	"appengine"
	"appengine/datastore"
	"log"
	"encoding/csv"
	"strings"
)

type Player struct {
	Name string
	Email string
	Phone string
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

func SavePlayer(c appengine.Context, s *Season, name string, email string, phone string, faction string) error {
	p := Player {
		Name: name,
		Email: email,
		Faction: faction,
		Phone: phone,
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

func CreatePlayersFromCsv(c appengine.Context, owningSeason *Season, csvData string) {
	strReader := strings.NewReader(csvData)
	csvReader := csv.NewReader(strReader)
	records, err := csvReader.ReadAll()
	if err != nil {
		log.Printf("Got an unexpected error [%v] reading csv data:\n%v", err, csvData)
		panic(err)
	}
	for _, row := range records {
		SavePlayer(c, owningSeason, row[0], row[2], row[3], row[1])
	}
}
