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

// Creates the schedule and attaches it to the season entity passed in
func generateSchedule(season *SeasonJson) {
	//TODO
}

// Creates and adds the divisions to the season entity passed in.
func generateDivisions(season *SeasonJson) {
	//TODO
}

// Creates a season for the passed in data and information.  This includes the conferences, divisions, players and schedule
func CreateSeason(c appengine.Context, name string, year string, conferenceCount int, divisionCount int, playersCsv string) {
	seasonJson := SeasonJson {
		Year: year,
		Name: name,
		Active: true,
		Divisions: make([]Division, divisionCount),
		Weeks: make([]Week, 0),
		Players: createPlayersFromCsv(playersCsv),
	}
	deactivateAllSeasons(c)
	generateDivisions(&seasonJson)
	generateSchedule(&seasonJson)
	season, players := CreateSeasonAndPlayers(c, seasonJson)
	SaveSeason(c, season)
	SavePlayers(c, &season, players)
}

