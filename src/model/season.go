package model

import (
	"appengine"
	"appengine/datastore"
	"log"
	"strings"
	"time"
)

type Season struct {
	Year string
	Name string
	Active bool
	Schedule []Byte `datastore:",noindex"`
	Divisions []Byte `datastore:",noindex"`
	Players []*datastore.Key
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

func deactivateAllSeasons(c appengine.Context) {
	q := datastore.NewQuery("Season").Filter("Active =", true)
	var seasons []Season
	_, err := q.GetAll(c, &seasons)
	if err != nil {
		c.Errorf("Error attempting to get all Seasons from the datastore '%s'", err)
		panic(err)
	}
	for _, s := range seasons {
		s.Active = false
		SaveSeason(c, s)
	}
}

// Creates a season for the passed in data and information.  This includes the conferences, divisions, players and schedule
func CreateSeason(c appengine.Context, name string, year string, conferenceCount int, divisionCount int, playersCsv string) {
	//TODO: implement this
	deactivateAllSeasons(c)
	season := Season {
		Year: year,
		Name: name,
		Active: true,
	}
	SaveSeason(c, season)
}
