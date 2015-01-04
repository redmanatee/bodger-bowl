package admin

import (
	"api"
	"appengine"
	"appengine/datastore"
	"encoding/json"
	"model"
	"net/http"
	"strconv"
	"strings"
	"regexp"
	"time"
)

func init() {

}

func createSeason(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	name := r.FormValue("name")
	year := r.FormValue("year")
	players := r.FormValue("players")
	conferenceCount, confErr := strconv.Atoi(r.FormValue("conferences"))
	if confErr != nil {
		c.Errorf("Error getting conference count: '%s'", confErr)
	}
	divisionCount, divErr := strconv.Atoi(r.FormValue("divisions"))
	if divErr != nil {
		c.Errorf("Error getting division count: '%s'", divErr)
	}
	if confErr == nil && divErr == nil {
		model.CreateSeason(c, name, year, conferenceCount, divisionCount, players)
	}
}

// Splits the game update data.
func splitGameUpdateData(c appengine.Context, data string) (player1Name string, player2Name string, winnerName string) {
	dataArr := strings.Split(data, ":")
	return dataArr[0], dataArr[1], dataArr[2]
}

// dispatcher for routes beginning with /admin/api/seasons/
func UpdateSeason(w http.ResponseWriter, r *http.Request) {
	subpath := strings.TrimPrefix(r.URL.Path, "/admin/api/seasons/")

	weekGameRegexp := regexp.MustCompile(`^([^/]+)/weeks/(\d+)/games/(\d+)`)
	weekGameMatches := weekGameRegexp.FindStringSubmatch(subpath)
	if weekGameMatches != nil {
		weekNumber, err := strconv.Atoi(weekGameMatches[2])
		if err != nil {
			panic(err)
		}
		gameIndex, err := strconv.Atoi(weekGameMatches[3])
		if err != nil {
			panic(err)
		}
		updateGame(w, r, weekGameMatches[1], weekNumber, gameIndex)
		return
	}

	weekRegexp := regexp.MustCompile(`^([^/]+)/weeks/(\d+)$`)
	weekMatches := weekRegexp.FindStringSubmatch(subpath)
	if weekMatches != nil {
		weekNumber, err := strconv.Atoi(weekMatches[2])
		if err != nil {
			panic(err)
		}
		updateWeek(w, r, weekMatches[1], weekNumber)
		return
	}

	addWeekRegexp := regexp.MustCompile(`^([^/]+)/weeks$`)
	addWeekMatches := addWeekRegexp.FindStringSubmatch(subpath)
	if addWeekMatches != nil {
		addWeek(w, r, addWeekMatches[1])
		return
	}

	panic("Unknown Path: " + r.URL.Path)
}

func PlayerBondDeleteHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasonName := r.FormValue("SeasonName")
	seasonYear := r.FormValue("SeasonYear")
	playerName := r.FormValue("Player")
	warcasterName := r.FormValue("Warcaster")
	warjackName := r.FormValue("Warjack")
	bondText := r.FormValue("BondText")
	bondNumber, err := strconv.Atoi(r.FormValue("BondNumber"))
	if err != nil {
		panic(err)
	}
	season := api.LoadSeasonByNameYear(c, seasonName, seasonYear)
	player := model.LoadPlayer(c, season, playerName)
	playerJson := player.CreatePlayerJson()
	index := 0
	for ; index < len(playerJson.Bonds.ActiveBonds); index++ {
		bond := playerJson.Bonds.ActiveBonds[index]
		if bond.Warcaster == warcasterName && bond.Warjack == warjackName && bond.BondNumber == bondNumber && bond.BondName == bondText {
			//We have found the match
			break
		}
	}
	if index >= len(playerJson.Bonds.ActiveBonds) {
		http.Error(w, "Could not find matching bond", 400)
	}
	playerJson.Bonds.ActiveBonds = append(playerJson.Bonds.ActiveBonds[:index], playerJson.Bonds.ActiveBonds[index+1:]...)
	updatedPlayer := playerJson.CreatePlayer()
	model.SavePlayer(c, season, &updatedPlayer)
}

func PlayerPotentialBondAddHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	c.Infof("Called adad potential bonds")
	seasonName := r.FormValue("SeasonName")
	seasonYear := r.FormValue("SeasonYear")
	playerName := r.FormValue("Player")
	warcasterName := r.FormValue("Warcaster")
	warjackName := r.FormValue("Warjack")
	bonus, err := strconv.Atoi(r.FormValue("Bonus"))
	if err != nil {
		panic(err)
	}
	season := api.LoadSeasonByNameYear(c, seasonName, seasonYear)
	player := model.LoadPlayer(c, season, playerName)
	playerJson := player.CreatePlayerJson()
	if playerJson.Bonds.PotentialBonds == nil {
		playerJson.Bonds.PotentialBonds = make([]model.PotentialBond, 0)
	}
	newPotential := model.PotentialBond {
		Warcaster: warcasterName,
		Warjack: warjackName,
		Bonus: bonus,
	}
	playerJson.Bonds.PotentialBonds = append(playerJson.Bonds.PotentialBonds, newPotential)
	updatedPlayer := playerJson.CreatePlayer()
	model.SavePlayer(c, season, &updatedPlayer)
}

func PlayerPotentialBondIncrementHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasonName := r.FormValue("SeasonName")
	seasonYear := r.FormValue("SeasonYear")
	playerName := r.FormValue("Player")
	warcasterName := r.FormValue("Warcaster")
	warjackName := r.FormValue("Warjack")
	bonus, err := strconv.Atoi(r.FormValue("Bonus"))
	if err != nil {
		panic(err)
	}
	season := api.LoadSeasonByNameYear(c, seasonName, seasonYear)
	player := model.LoadPlayer(c, season, playerName)
	playerJson := player.CreatePlayerJson()
	index := 0
	for ; index < len(playerJson.Bonds.PotentialBonds); index++ {
		bond := playerJson.Bonds.PotentialBonds[index]
		if bond.Warcaster == warcasterName && bond.Warjack == warjackName && bond.Bonus == bonus {
			//We have found the match
			break
		}
	}
	if index >= len(playerJson.Bonds.PotentialBonds) {
		http.Error(w, "Could not find matching potential bond", 400)
	}
	playerJson.Bonds.PotentialBonds[index].Bonus++
	updatedPlayer := playerJson.CreatePlayer()
	model.SavePlayer(c, season, &updatedPlayer)
}

func PlayerPotentialBondDeleteHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasonName := r.FormValue("SeasonName")
	seasonYear := r.FormValue("SeasonYear")
	playerName := r.FormValue("Player")
	warcasterName := r.FormValue("Warcaster")
	warjackName := r.FormValue("Warjack")
	bonus, err := strconv.Atoi(r.FormValue("Bonus"))
	if err != nil {
		panic(err)
	}
	season := api.LoadSeasonByNameYear(c, seasonName, seasonYear)
	player := model.LoadPlayer(c, season, playerName)
	playerJson := player.CreatePlayerJson()
	index := 0
	for ; index < len(playerJson.Bonds.PotentialBonds); index++ {
		bond := playerJson.Bonds.PotentialBonds[index]
		if bond.Warcaster == warcasterName && bond.Warjack == warjackName && bond.Bonus == bonus {
			//We have found the match
			break
		}
	}
	if index >= len(playerJson.Bonds.PotentialBonds) {
		http.Error(w, "Could not find matching potential bond", 400)
	}
	playerJson.Bonds.PotentialBonds = append(playerJson.Bonds.PotentialBonds[:index], playerJson.Bonds.PotentialBonds[index+1:]...)
	updatedPlayer := playerJson.CreatePlayer()
	model.SavePlayer(c, season, &updatedPlayer)
}

func PlayerBondAddHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasonName := r.FormValue("SeasonName")
	seasonYear := r.FormValue("SeasonYear")
	playerName := r.FormValue("Player")
	warcasterName := r.FormValue("Warcaster")
	warjackName := r.FormValue("Warjack")
	bondText := r.FormValue("BondText")
	bondNumber, err := strconv.Atoi(r.FormValue("BondNumber"))
	if err != nil {
		panic(err)
	}
	season := api.LoadSeasonByNameYear(c, seasonName, seasonYear)
	player := model.LoadPlayer(c, season, playerName)
	playerJson := player.CreatePlayerJson()
	if playerJson.Bonds.ActiveBonds == nil {
		playerJson.Bonds.ActiveBonds = make([]model.ActiveBond, 0)
	}
	newBond := model.ActiveBond {
		Warcaster: warcasterName,
		Warjack: warjackName,
		BondNumber: bondNumber,
		BondName: bondText,
	}
	playerJson.Bonds.ActiveBonds = append(playerJson.Bonds.ActiveBonds, newBond)
	updatedPlayer := playerJson.CreatePlayer()
	model.SavePlayer(c, season, &updatedPlayer)
}

// Handles the update calls of the players
func PlayerInjuryUpdateHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	c.Infof("Called player injury update handler")
	seasonName := r.FormValue("SeasonName")
	seasonYear := r.FormValue("SeasonYear")
	playerName := r.FormValue("Player")
	injuryString := r.FormValue("Injuries")
	c.Infof("'%v' '%v' '%v' '%v'", seasonName, seasonYear, playerName, injuryString)
	season := api.LoadSeasonByNameYear(c, seasonName, seasonYear)
	player := model.LoadPlayer(c, season, playerName)
	if strings.TrimSpace(injuryString) == "" {
		player.Injuries = make([]string, 0)
	} else {
		player.Injuries = strings.Split(injuryString, ",")
	}
	model.SavePlayer(c, season, player)
}

func playerIndex(players []*model.Player, name string) int {
	for p, v := range players {
		if (v.Name == name) {
			return p
		}
	}
	return -1
}

func SetPlayerName(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasonName := r.FormValue("SeasonName")
	seasonYear := r.FormValue("SeasonYear")
	playerId := r.FormValue("PlayerId")
	newPlayerName := r.FormValue("NewPlayerName")
	c.Infof("Replaceing '%v' with '%v' for season '%v' '%v'", playerId, newPlayerName, seasonName, seasonYear)
	var season *model.Season
	if seasonName == "" || seasonYear == "" {
		c.Infof("Lookup season")
		tmpSeason := api.GetActiveSeasonWithContext(c)
		season = &tmpSeason
	} else {
		season = api.LoadSeasonByNameYear(c, seasonName, seasonYear)
	}
	players := season.GetPlayers(c)
	targetIndex := playerIndex(players, playerId)
	replacePlayer := players[targetIndex]
	replacePlayer.Name = newPlayerName
	season.Schedule = []byte(strings.Replace(string(season.Schedule), playerId, newPlayerName, -1))
	season.Conferences = []byte(strings.Replace(string(season.Conferences), playerId, newPlayerName, -1))
	pkey := model.PlayerKey(c, season.Name, season.Year, newPlayerName)
	season.Players[targetIndex] = pkey
	err := datastore.RunInTransaction(c, func(c appengine.Context) error {
		model.SavePlayer(c, season, replacePlayer)
		err := model.SaveSeason(c, *season)
		return err
	}, nil)
	if err != nil {
		panic(err)
	}
}

func SetPlayerFaction(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasonName := r.FormValue("SeasonName")
	seasonYear := r.FormValue("SeasonYear")
	playerId := r.FormValue("PlayerId")
	newFaction := r.FormValue("NewFaction")
	var season *model.Season
	if seasonName == "" || seasonYear == "" {
		c.Infof("Lookup season")
		tmpSeason := api.GetActiveSeasonWithContext(c)
		season = &tmpSeason
	} else {
		season = api.LoadSeasonByNameYear(c, seasonName, seasonYear)
	}
	player := model.LoadPlayer(c, season, playerId)
	player.Faction = newFaction
	model.SavePlayer(c, season, player)
}

func TogglePlayerStandin(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasonName := r.FormValue("SeasonName")
	seasonYear := r.FormValue("SeasonYear")
	playerId := r.FormValue("PlayerId")
	var season *model.Season
	if seasonName == "" || seasonYear == "" {
		c.Infof("Lookup season")
		tmpSeason := api.GetActiveSeasonWithContext(c)
		season = &tmpSeason
	} else {
		season = api.LoadSeasonByNameYear(c, seasonName, seasonYear)
	}
	player := model.LoadPlayer(c, season, playerId)
	player.Standin = !player.Standin
	model.SavePlayer(c, season, player)
}

// Handles updating a game
func updateGame(w http.ResponseWriter, r *http.Request, seasonId string, weekNumber int, gameIndex int) {
	c := appengine.NewContext(r)
	winnerName := r.FormValue("winnerName")
	player1Name := r.FormValue("player1Name")
	player2Name := r.FormValue("player2Name")
	season := api.LoadSeasonById(c, seasonId)
	var weeks []model.Week
	err := json.Unmarshal(season.Schedule, &weeks)
	if err != nil {
		panic(err)
	}
	game := &(weeks[weekNumber-1].Games[gameIndex])
	game.WinnerId = winnerName
	game.PlayerIds[0] = player1Name
	game.PlayerIds[1] = player2Name
	newSchedule, err := json.Marshal(weeks)
	if err != nil {
		panic(err)
	}
	season.Schedule = newSchedule
	model.SaveSeason(c, *season)
}

// handles adding a week
func addWeek(w http.ResponseWriter, r *http.Request, seasonId string) {
	c := appengine.NewContext(r)
	season := api.LoadSeasonById(c, seasonId)

	playDate := r.FormValue("playDate")
	var scenarios []int

	if(r.FormValue("scenarios") != "") {
		scenarioStrings := strings.Split(r.FormValue("scenarios"), ",")

		scenarios = make([]int, len(scenarioStrings))
		for i, v := range scenarioStrings {
			scenario, err := strconv.Atoi(v)
			if err != nil {
				panic(err)
			}
			scenarios[i] = scenario
		}
	}

	var weeks []model.Week
	err := json.Unmarshal(season.Schedule, &weeks)
	if err != nil {
		panic(err)
	}

	var playDateTime *time.Time
	if playDate == "" {
		playDateTime = nil
	} else {
		playDateTimeP, err := time.Parse("2006-01-02", playDate)
		playDateTime = &playDateTimeP
		if err != nil {
			panic(err)
		}
	}

	newWeek := model.Week {
		PlayDate: playDateTime,
		Scenarios: scenarios,
		Games: make([]model.Game, 0),
	}
	weeks = append(weeks, newWeek)
	newData, err := json.Marshal(weeks)
	if err != nil {
		panic(err)
	}
	season.Schedule = newData
	model.SaveSeason(c, *season)
}

// handles updating the scenarios and playdates for a week
func updateWeek(w http.ResponseWriter, r *http.Request, seasonId string, weekNumber int) {
	c := appengine.NewContext(r)
	season := api.LoadSeasonById(c, seasonId)

	playDate := r.FormValue("playDate")
	var scenarios []int

	if(r.FormValue("scenarios") != "") {
		scenarioStrings := strings.Split(r.FormValue("scenarios"), ",")

		scenarios = make([]int, len(scenarioStrings))
		for i, v := range scenarioStrings {
			scenario, err := strconv.Atoi(v)
			if err != nil {
				panic(err)
			}
			scenarios[i] = scenario
		}
	}

	var weeks []model.Week
	err := json.Unmarshal(season.Schedule, &weeks)
	if err != nil {
		panic(err)
	}

	var playDateTime *time.Time
	if playDate == "" {
		playDateTime = nil
	} else {
		playDateTimeP, err := time.Parse("2006-01-02", playDate)
		playDateTime = &playDateTimeP
		if err != nil {
			panic(err)
		}
	}
	weeks[weekNumber - 1].PlayDate = playDateTime
	weeks[weekNumber - 1].Scenarios = scenarios
	newData, err := json.Marshal(weeks)
	if err != nil {
		panic(err)
	}
	season.Schedule = newData
	model.SaveSeason(c, *season)
}
