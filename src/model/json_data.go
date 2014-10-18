package model

import (
	"time"
	"encoding/json"
	"appengine"
	"appengine/datastore"
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
	Bonus int
	SuccessfulBond bool
}

type SeasonJson struct {
	Year string
	Name string
	Active bool
	Divisions []Division
	Weeks []Week
	Players []PlayerJson
}

func (s SeasonJson) GetYear() string {
	return s.Year
}

func (s SeasonJson) GetName() string {
	return s.Name
}


func createDivisions(season Season) []Division {
	var divisions []Division
	err := json.Unmarshal(season.Divisions, &divisions)
	if err != nil {
		panic(err)
	}
	return divisions
}

func createWeeks(season Season) []Week {
	var weeks []Week
	err := json.Unmarshal(season.Schedule, &weeks)
	if err != nil {
		panic(err)
	}
	return weeks
}

func createBonds(player Player) []Bond {
	var bonds []Bond
	err := json.Unmarshal(player.Bonds, &bonds)
	if err != nil {
		panic(err)
	}
	return bonds
}

func (player Player) CreatePlayerJson() PlayerJson {
	return PlayerJson {
			Name: player.Name,
			Email: player.Email,
			Phone: player.Phone,
			Faction: player.Faction,
			Injuries: player.Injuries,
			Bonds: createBonds(player),
		}
}

func createPlayersJson(season Season, c appengine.Context) []PlayerJson {
	players := make([]PlayerJson, len(season.Players))
	for index, player := range season.GetPlayers(c) {
		players[index] = player.CreatePlayerJson()
	}
	return players
}

// Creates a SeasonJson object from a Season object for transferring data back and forth.
func (season Season) CreateJsonSeason(c appengine.Context) SeasonJson {
	return SeasonJson {
		Year: season.Year,
		Name: season.Name,
		Active: season.Active,
		Divisions: createDivisions(season),
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
		playerKeys[index] = playerKey(c, &s, p.Email)
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
		Phone: p.Phone,
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
	divisions, err := json.Marshal(s.Divisions)
	if err != nil {
		panic(err)
	}
	return Season {
		Year: s.Year,
		Name: s.Name,
		Active: s.Active,
		Players: players,
		Schedule: schedule,
		Divisions: divisions,
	}
}
