package model

import (
	"appengine"
	"appengine/datastore"
	"log"
	"strings"
)

type Season struct {
	Year string
	Name string
	Active bool
	Schedule []byte `datastore:",noindex"`
	Conferences []byte `datastore:",noindex"`
	Players []*datastore.Key
}

func (s Season) GetPlayers(c appengine.Context) []*Player {
	var players []*Player = make([]*Player, len(s.Players), len(s.Players))
	//Have to do this because appengine is fucking stupid and requires the entity to exist
	//prior to loading.
	for index := 0; index < len(players); index++ {
		players[index] = new(Player)
	}
	c.Infof("Player count to lookup: '%d'", len(s.Players))
	err := datastore.GetMulti(c, s.Players, players)
	if err != nil {
		c.Errorf("Error loading players: '%v'", err)
		panic(err)
	}
	c.Infof("Players retrieved: '%v'", players)
	return players
}

func seasonKey(c appengine.Context, name string, year string) *datastore.Key {
	keyname := strings.Join([]string{name, year}, ":")
	return datastore.NewKey(c, "Season", keyname, 0, nil)
}

func SaveSeason(c appengine.Context, s Season) error {
	key := seasonKey(c, s.Name, s.Year)
	_, err := datastore.Put(c, key, &s)
	return err
}

func LoadSeason(c appengine.Context, name string, year string) *Season {
	key := seasonKey(c, name, year)
	var s Season
	err := datastore.Get(c, key, &s)
	if err == datastore.ErrNoSuchEntity {
		return nil
	} else if err != nil {
		log.Printf("Got an unexpected error looking up a season: %v", err)
	}
	return &s
}

func LoadCurrentSeason(c appengine.Context) *Season {
	q := datastore.NewQuery("Season").Filter("Active =", true)
	var seasons []Season
	_, err := q.GetAll(c, &seasons)
	if err != nil {
		log.Printf("Error loading current season %v", err)
		return nil
	}
	if len(seasons) == 0 {
		return nil
	}
	return &(seasons[0])
}

func LoadAllSeasons(c appengine.Context) []Season {
	q := datastore.NewQuery("Season")
	var seasons []Season
	_, err := q.GetAll(c, &seasons)
	if err != nil {
		log.Printf("Error loading all seasons '%v'", err)
		return []Season{}
	}
	return seasons
}

