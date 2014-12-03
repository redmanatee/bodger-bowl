package model

import (
	"appengine"
	"appengine/datastore"
	"encoding/csv"
	"log"
	"strings"
)

type Player struct {
	Name string
	Faction string
	Wins int
	Losses int
	Standin bool
	Injuries []string `datastore:",noindex"`
	Bonds []byte `datastore:",noindex"`
}

func PlayerKey(c appengine.Context, seasonName string, year string, playerName string) *datastore.Key {
	sKey := seasonKey(c, seasonName, year)
	return datastore.NewKey(c, "Player", playerName, 0, sKey)
}

func SavePlayer(c appengine.Context, s *Season, player *Player) {
	var name, year string
	if s != nil {
		name = s.Name
		year = s.Year
	}
	key := PlayerKey(c, name, year, player.Name)
	_, err := datastore.Put(c, key, player)
	if err != nil {
		panic(err)
	}
}

func SavePlayers(c appengine.Context, s *Season, players []Player) []*datastore.Key {
	keys := make([]*datastore.Key, len(players))
	var name, year string
	if s != nil {
		name = s.Name
		year = s.Year
	}
	for index, player := range players {
		keys[index] = PlayerKey(c, name, year, player.Name)
	}
	keys, err := datastore.PutMulti(c, keys, players)
	if err != nil {
		panic(err)
	}
	return keys
}

func LoadPlayer(c appengine.Context, s *Season, playerName string) *Player {
	var name, year string
	if s != nil {
		name = s.Name
		year = s.Year
	}	
	key := PlayerKey(c, name, year, playerName)
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
			Faction: row[1],
			Standin: false,
			Injuries: make([]string, 0),
			Bonds: *new(BondSet),
		}
	}
	return players
}


