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

