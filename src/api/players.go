package api

import (
	"appengine"
	"encoding/json"
	"model"
	"net/http"
)

func GetPlayer(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasonId := r.FormValue("SeasonId")
	playerId := r.FormValue("PlayerId")
	c.Infof("Looking up '%v' for season '%v'", playerId, seasonId)
	var player *model.Player
	var season *model.Season
	if seasonId == "" {
		c.Infof("Lookup season")
		tmpSeason := GetActiveSeasonWithContext(c)
		season = &tmpSeason
	} else {
		season = LoadSeasonById(c, seasonId)
	}
	player = model.LoadPlayer(c, season, playerId)
	c.Infof("%v", player)
	c.Infof(string(player.Bonds))
	playerJson := player.CreatePlayerJson()
	data, err := json.Marshal(playerJson)
	if err != nil {
		panic(err)
	}
	w.Write(data)
}
