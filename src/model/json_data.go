package model

import (
	"time"
	"encoding/json"
	"appengine"
	"appengine/datastore"
)

type Conference struct {
	Name string
	Divisions []Division
}

type Division struct {
	Name string
	PlayerIds []string
}

type Week struct {
	PlayDate *time.Time
	Scenarios []int
	Games []Game
}

type Game struct {
	PlayerIds []string
	WinnerId string
}

type PlayerJson struct {
	Name string
	Email string
	Faction string
	Standin bool
	Injuries []string
	Bonds BondSet
}

type BondSet struct {
	ActiveBonds []ActiveBond
	PotentialBonds []PotentialBond
}

type PotentialBond struct {
	Warcaster string
	Warjack string
	Bonus int
}

type ActiveBond struct {
	Warcaster string
	Warjack string
	BondNumber int
	BondName string
}

type SeasonJson struct {
	Year string
	Name string
	Active bool
	Conferences []Conference
	Weeks []Week
	Players []PlayerJson
}

func createConferences(season Season) []Conference {
	var conference []Conference
	err := json.Unmarshal(season.Conferences, &conference)
	if err != nil {
		panic(err)
	}
	return conference
}

func createWeeks(season Season) []Week {
	var weeks []Week
	err := json.Unmarshal(season.Schedule, &weeks)
	if err != nil {
		panic(err)
	}
	return weeks
}

func createBonds(player Player) BondSet {
	var bonds BondSet
	err := json.Unmarshal(player.Bonds, &bonds)
	if err != nil {
		panic(err)
	}
	return bonds
}

func (player Player) CreatePlayerJson() PlayerJson {
	//Note: we don't apply the email or phone number to help our end users keep that information private.
	return PlayerJson {
			Name: player.Name,
			Email: player.Email,
			Faction: player.Faction,
			Standin: player.Standin,
			Injuries: player.Injuries,
			Bonds: createBonds(player),
		}
}

func createPlayersJson(season Season, c appengine.Context) []PlayerJson {
	players := make([]PlayerJson, len(season.Players))
	if len(players) > 0 {
		for index, player := range season.GetPlayers(c) {
			players[index] = player.CreatePlayerJson()
		}
	}
	return players
}

// Creates a SeasonJson object from a Season object for transferring data back and forth.
func (season Season) CreateJsonSeason(c appengine.Context) SeasonJson {
	return SeasonJson {
		Year: season.Year,
		Name: season.Name,
		Active: season.Active,
		Conferences: createConferences(season),
		Weeks: createWeeks(season),
		Players: createPlayersJson(season, c),
	}
}

// Creates the season and players for saving in the datastore
func CreateSeasonAndPlayers(c appengine.Context, s SeasonJson) (Season, []Player) {
	players := make([]Player, len(s.Players))
	playerKeys := make([]*datastore.Key, len(players))
	for index, p := range s.Players {
		players[index] = p.CreatePlayer()
		playerKeys[index] = PlayerKey(c, s.Name, s.Year, p.Name)
	}
	return s.createSeason(playerKeys), players
}

func (p PlayerJson) CreatePlayer() Player {
	bonds, err := json.Marshal(p.Bonds)
	if err != nil {
		panic(err)
	}
	return Player {
		Name: p.Name,
		Email: p.Email,
		Standin: p.Standin,
		Faction: p.Faction,
		Injuries: p.Injuries,
		Bonds: bonds,
	}
}

func (s SeasonJson) createSeason(players []*datastore.Key) Season {
	schedule, err := json.Marshal(s.Weeks)
	if err != nil {
		panic(err)
	}
	conferences, err := json.Marshal(s.Conferences)
	if err != nil {
		panic(err)
	}
	return Season {
		Year: s.Year,
		Name: s.Name,
		Active: s.Active,
		Players: players,
		Schedule: schedule,
		Conferences: conferences,
	}
}
