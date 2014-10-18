package model

import (
	"appengine"
	"appengine/datastore"
)

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

