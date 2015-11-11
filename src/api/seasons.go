package api

import (
	"appengine"
	"appengine/datastore"
	"appengine/mail"
	"encoding/json"
	"model"
	"net/http"
	"strings"
	"strconv"
	"regexp"
	"fmt"
)


// dispatcher for routes beginning with /api/seasons/update/
func PublicUpdateSeason(w http.ResponseWriter, r *http.Request) {
	subpath := strings.TrimPrefix(r.URL.Path, "/api/seasons/update/")
	
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
		if r.Method == "PUT" {
			updateGame(w, r, weekGameMatches[1], weekNumber, gameIndex)
			return
		} else {
			panic("Bad Method (Path, Method): (" + r.URL.Path + ", " + r.Method + ")")
		}
	}
}

// dispatcher for routes beginning with /api/seasons/dispute/
func DisputeGame(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	subpath := strings.TrimPrefix(r.URL.Path, "/api/seasons/dispute/")
	c.Infof("DisputeGame()")
	c.Infof("URL: '%v'", r.URL.Path)
	c.Infof("subpath: '%v'", subpath)
	
	weekGameRegexp := regexp.MustCompile(`^([^/]+)/weeks/(\d+)/games/(\d+)`)
	weekGameMatches := weekGameRegexp.FindStringSubmatch(subpath)
	c.Infof("weekGameMatches: '%v'", weekGameMatches)
	
	if weekGameMatches != nil {
		weekNumber, err := strconv.Atoi(weekGameMatches[2])
		if err != nil {
			panic(err)
		}
		gameIndex, err := strconv.Atoi(weekGameMatches[3])
		if err != nil {
			panic(err)
		}
		if r.Method == "PUT" {
			updateGameDispute(w, r, weekGameMatches[1], weekNumber, gameIndex)
			return
		} else {
			panic("Bad Method (Path, Method): (" + r.URL.Path + ", " + r.Method + ")")
		}
	}
}

func getAllSeasons(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasons := model.LoadAllSeasons(c)
	data, err := json.MarshalIndent(seasons, "", "\t")
	if err != nil {
		c.Errorf("Unexpected error marshalling seasons: %v", err)
		panic(err)
	}
	w.Write(data)
}

func LoadSeasonById(c appengine.Context, seasonId string) *model.Season {
	seasonArr := strings.Split(seasonId, ";")
	return LoadSeasonByNameYear(c, seasonArr[0], seasonArr[1])
}

func LoadSeasonByNameYear(c appengine.Context, seasonName string, seasonYear string) *model.Season {
	season := model.LoadSeason(c, seasonName, seasonYear)
	return season	
}

func getOneSeason(w http.ResponseWriter, r *http.Request, seasonInfo string) {
	c := appengine.NewContext(r)
	season := LoadSeasonById(c, seasonInfo)
	data, err := json.MarshalIndent(season.CreateJsonSeason(c), "", "\t")
	if err != nil {
		c.Errorf("Unexpected error marshalling a season: %v", err)
		panic(err)
	}
	w.Write(data)
}

func GetActiveSeasonWithContext(c appengine.Context) model.Season {
	q := datastore.NewQuery("Season").Filter("Active = ", true).Limit(1)
	var seasons []model.Season
	_, err := q.GetAll(c, &seasons)
	if err != nil {
		panic(err)
	}
	return seasons[0]
}

func GetActiveSeason(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	season := GetActiveSeasonWithContext(c)
	data, err := json.MarshalIndent(season.CreateJsonSeason(c), "", "\t")
	if err != nil {
		panic(err)
	}
	w.Write(data)
}

func SeasonList(w http.ResponseWriter, r *http.Request) {
	pathItems := strings.Split(r.URL.Path, "/")
	lastItem := pathItems[len(pathItems)-1]
	if lastItem != "" {
		getOneSeason(w, r, lastItem)
	} else {
		getAllSeasons(w, r)
	}
}

// Handles updating a game by a non-admin user
func updateGame(w http.ResponseWriter, r *http.Request, seasonId string, weekNumber int, gameIndex int) {
	c := appengine.NewContext(r)
	winnerName := r.FormValue("winnerName")
	player1Name := r.FormValue("player1Name")
	player2Name := r.FormValue("player2Name")
	season := LoadSeasonById(c, seasonId)
	var weeks []model.Week
	
	err := json.Unmarshal(season.Schedule, &weeks)
	if err != nil {
		panic(err)
	}
	game := &(weeks[weekNumber-1].Games[gameIndex])
	game.WinnerId = winnerName
	game.PlayerIds[0] = player1Name
	game.PlayerIds[1] = player2Name
	c.Infof("Updating game %v, %v: %v", weekNumber, gameIndex, weeks)
	newSchedule, err := json.Marshal(weeks)
	if err != nil {
		panic(err)
	}
	season.Schedule = newSchedule
	err = model.SaveSeason(c, *season)
	if err != nil {
		panic(err)
	}
}

func updateGameDispute(w http.ResponseWriter, r *http.Request, seasonId string, weekNumber int, gameIndex int) {
	c := appengine.NewContext(r)
	winnerName := r.FormValue("winnerName")
	player1Name := r.FormValue("player1Name")
	player2Name := r.FormValue("player2Name")
	isDisputed, err := strconv.ParseBool(r.FormValue("isDisputed"))
	if err != nil {
		panic(err)
	}
	
	c.Infof("winner: %v", winnerName)
	c.Infof("player1Name: %v", player1Name)
	c.Infof("player2Name: %v", player2Name)
	c.Infof("isDisputed: %v", isDisputed)
	season := LoadSeasonById(c, seasonId)
	
	const emailMessage = `
	A dispute was submitted for the game between
	%s and %s.
	
	Winner: %s
	`
	
	const emailSubject = `
	"%s -- Automated Dispute Notification"
	`
	
	msg := &mail.Message{
			Sender:  "",
			To:      []string{"ymihere03@gmail.com"},
			Subject: fmt.Sprintf(emailSubject, season.Name),
			Body:    fmt.Sprintf(emailMessage, player1Name, player2Name, winnerName),
	}
	if err := mail.Send(c, msg); err != nil {
		c.Errorf("Couldn't send email: %v", err)
	}
	
	var weeks []model.Week
	err2 := json.Unmarshal(season.Schedule, &weeks)
	if err2 != nil {
		panic(err2)
	}
	game := &(weeks[weekNumber-1].Games[gameIndex])
	game.IsDisputed = isDisputed
	c.Infof("Disputing game %v, %v: %v", weekNumber, gameIndex, weeks)
	newSchedule, err := json.Marshal(weeks)
	if err != nil {
		panic(err)
	}
	season.Schedule = newSchedule
	err = model.SaveSeason(c, *season)
	if err != nil {
		panic(err)
	}
}
