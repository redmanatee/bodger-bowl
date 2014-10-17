package model

import (
	"time"
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



