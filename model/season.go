package model

import (
	"appengine"
	"appengine/datastore"
	"log"
)

type Season struct {
	Year string
	Name string
	Active bool
}

func SaveSeason(c appengine.Context, name string, year string) error {
	s := Season{
		Year: year,
		Name: name,
		Active: true,
	}
	key := datastore.NewIncompleteKey(c, "Season", nil)
	_, err := datastore.Put(c, key, &s)
	return err
}

func LoadCurrentSeason(c appengine.Context) *Season {
	q := datastore.NewQuery("Season")
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
