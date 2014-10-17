package model

import (
	"time"
	"json"
)

type Division struct {
	Name string
	Conferences []Conference
}

type Conference struct {
	Name string
	PlayerIds []string
}

type Week struct {
	Number int
	Date time.Time
	Games []Game
}

type Game struct {
	PlayerIds []string
	WinnerId string
}

type PlayerJson struct {
	Name string
	Email string
	Phone string
	Faction string
	Injuries []string
	Bonds []Bond
}

type Bond struct {
	Warcaster string
	Warjack string
	BondNumber int
	BondName string
}

type SeasonJson struct {
	Year string
	Name string
	Active bool
	Divisions []Division
	Weeks []Week
	Players []PlayerJson
}

func createDivisions(season Season) []Division {
	var divisions []Division
	err := json.unmarshall(season.Divisions, &divisions)
	if err != nil {
		panic(err)
	}
	return divisions
}

func createWeeks(season Season) []Week {
	var weeks []Week
	err := json.unmarshall(season.Schedule, &weeks)
	if err != nil {
		panic(err)
	}
	return weeks
}

func createBonds(player Player) []Bond {
	var bonds []Bond
	err := json.unmarshall(player.Bonds, &bonds)
	if err != nil {
		panic(err)
	}
	return bonds
}

func createPlayersJson(season Season) []PlayerJson {
	players := make([]PlayerJson, len(season.Players))
	for index, player := range season.Players {
		players[index] = PlayerJson {
			Name: player.Name,
			Email: player.Email,
			Phone: player.Phone,
			Faction: player.Faction,
			Injuries: player.Injuries
			Bonds: createBonds(player)
		}
	}
	return players
}

// Creates a SeasonJson object from a Season object for transferring data back and forth.
func CreateJsonSeason(season Season) SeasonJson {
	jsonseason := SeasonJson {
		Year: season.Year,
		Name: season.Name,
		Active: season.Active,
		Divisions: createDivisions(season),
		Weeks: createWeeks(season),
		Players: createPlayersJson(season)
	}
	return jsonSeason
}

