package api

import (
	"appengine"
	"appengine/datastore"
	"encoding/json"
	"model"
	"net/http"
	"strings"
)


func getAllSeasons(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	c.Infof("Getting all seasons")
	seasons := model.LoadAllSeasons(c)
	data, err := json.MarshalIndent(seasons, "", "\t")
	if err != nil {
		c.Errorf("Unexpected error marshalling seasons: %v", err)
		panic(err)
	}
	c.Infof("Season count: '%d'", len(seasons))
	w.Write(data)
}

func getOneSeason(w http.ResponseWriter, r *http.Request, seasonInfo string) {
	c := appengine.NewContext(r)
	seasonArr := strings.Split(seasonInfo, ";")
	c.Infof("Season request array split: '%v'", seasonArr)
	season := model.LoadSeason(c, seasonArr[0], seasonArr[1])
	data, err := json.MarshalIndent(season.CreateJsonSeason(c), "", "\t")
	if err != nil {
		c.Errorf("Unexpected error marshalling a season: %v", err)
		panic(err)
	}
	w.Write(data)
}

func GetActiveSeason(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	c.Infof("Called getactiveseason")
	q := datastore.NewQuery("Season").Filter("Active = ", true).Limit(1)
	var seasons []model.Season
	_, err := q.GetAll(c, &seasons)
	if err != nil {
		panic(err)
	}
	if len(seasons) > 0 {
		c.Infof("found season '%v'", seasons[0])
		data, err := json.MarshalIndent(seasons[0].CreateJsonSeason(c), "", "\t")
		if err != nil {
			panic(err)
		}
		w.Write(data)
	} else {
		c.Infof("Did not get back any seasons")
	}
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

