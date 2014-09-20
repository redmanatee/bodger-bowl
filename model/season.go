package model

import (
	"appengine"
	"appengine/datastore"
)

type Season struct {
	Year string
	Name string
	Active bool
}

func SaveSeason(name string, year string, c appengine.Context) error {
	s := Season{
		Year: year,
		Name: name,
		Active: false,
	}
	key := datastore.NewIncompleteKey(c, "Season", nil)
	_, err := datastore.Put(c, key, &s)
	return err
}
