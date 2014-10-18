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
	Injuries []string `datastore:",noindex"`
	Bonds []byte `datastore:",noindex"`
}

func playerKey(c appengine.Context, seasonName string, year string, playerName string) *datastore.Key {
	c.Infof("Player name: '%v'", playerName)
	// modPlayerName := strings.Replace(playerName, " ", "_", -1)
	// c.Infof("Mod Player name: '%v'", modPlayerName)
	sKey := seasonKey(c, seasonName, year)
	return datastore.NewKey(c, "Player", playerName, 0, sKey)
}

func SavePlayers(c appengine.Context, s *Season, players []Player) {
	keys := make([]*datastore.Key, len(players))
	var name, year string
	if s != nil {
		name = s.Name
		year = s.Year
	}
	for index, player := range players {
		keys[index] = playerKey(c, name, year, player.Name)
	}
	c.Infof("Creating player keys: '%v'", keys)
	_, err := datastore.PutMulti(c, keys, players)
	if err != nil {
		panic(err)
	}
}

func LoadPlayer(c appengine.Context, s *Season, playerName string) *Player {
	var name, year string
	if s != nil {
		name = s.Name
		year = s.Year
	}	
	key := playerKey(c, name, year, playerName)
	var p Player
	err := datastore.Get(c, key, &p)
	if err == datastore.ErrNoSuchEntity {
		return nil
	} else if err != nil {
		log.Printf("Got an unexpected error looking up a season: %v", err)
	}
	return &p
}

// Creates PlayerJson objects from the CSV passed in
func createPlayersFromCsv(csvData string) []PlayerJson {
	strReader := strings.NewReader(csvData)
	csvReader := csv.NewReader(strReader)
	records, err := csvReader.ReadAll()
	if err != nil {
		log.Printf("Got an unexpected error [%v] reading csv data:\n%v", err, csvData)
		panic(err)
	}
	players := make([]PlayerJson, len(records))
	for index, row := range records {
		players[index] = PlayerJson {
			Name: row[0],
			Email: row[2],
			Phone: row[3],
			Faction: row[1],
			Injuries: make([]string, 0),
			Bonds: make([]Bond, 0),
		}
	}
	return players
}


