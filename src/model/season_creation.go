package model

import (
	"appengine"
	"appengine/datastore"
	"strconv"
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
func generateDivisions(season *SeasonJson, conferenceCount int, divisionCount int) {
	for i := 0; i < conferenceCount; i++ {
		divisions := make([]Division, divisionCount)
		for j := 0; j < divisionCount; j++ {
			divisions[j] = Division {
				Name: "Division" + strconv.Itoa(j),
				PlayerIds: make([]string, 0),
			}
		}
		season.Conferences[i] = Conference {
			Name: "Conference " + strconv.Itoa(i+1),
			Divisions: divisions,
		}
	}
	playersOrdered := make([]PlayerJson, 0)
	for _, v := range playersByFaction(season.Players) {
		playersOrdered = append(playersOrdered, v...)
	}
	divisions := make([]*Division, conferenceCount * divisionCount)
	for d := 0; d < divisionCount; d++ {
		for c := 0; c < conferenceCount; c++ {
			divisions[c + (d * conferenceCount)] = &(season.Conferences[c].Divisions[d])
		}
	}
	for i, p := range playersOrdered {
		divisionIndex := i % len(divisions)
		divisions[divisionIndex].PlayerIds = append(divisions[divisionIndex].PlayerIds, p.Email)
		divisionIndex++
	}
}

// Creates a map of the players by faction.
func playersByFaction(players []PlayerJson) map[string][]PlayerJson {
	playersByFaction := make(map[string][]PlayerJson)
	for _, p := range players {
		playersByFaction[p.Faction] = append(playersByFaction[p.Faction], p)
	}
	return playersByFaction
}

// Creates a season for the passed in data and information.  This includes the conferences, divisions, players and schedule
func CreateSeason(c appengine.Context, name string, year string, conferenceCount int, divisionCount int, playersCsv string) {
	seasonJson := SeasonJson {
		Year: year,
		Name: name,
		Active: true,
		Conferences: make([]Conference, conferenceCount),
		Weeks: make([]Week, 0),
		Players: createPlayersFromCsv(playersCsv),
	}
	deactivateAllSeasons(c)
	generateDivisions(&seasonJson, conferenceCount, divisionCount)
	generateSchedule(&seasonJson)
	season, players := CreateSeasonAndPlayers(c, seasonJson)
	SaveSeason(c, season)
	SavePlayers(c, &season, players)
}

