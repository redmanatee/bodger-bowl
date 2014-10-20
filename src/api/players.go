package api

import (
	"appengine"
	"appengine/datastore"
	"encoding/json"
	"model"
	"net/http"
	"strings"
)

func GetPlayer(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasonId := r.FormValue("SeasonId")
	playerId := r.FormValue("PlayerId")
	c.Infof("Looking up '%v' for season '%v'", playerId, seasonId)
	var player *model.Player
	if seasonId == "" {
		activeSeason := getActiveSeasonWithContext(c)
		player = model.LoadPlayer(c, &activeSeason, playerId)
	} else {
		seasonParts := strings.Split(seasonId, ";")
		playerKey := model.PlayerKey(c, seasonParts[0], seasonParts[1], playerId)
		err := datastore.Get(c, playerKey, player)
		if err != nil {
			panic(err)
		}
	}
	c.Infof("%v", player)
	c.Infof(string(player.Bonds))
	playerJson := player.CreatePlayerJson()
	data, err := json.Marshal(playerJson)
	if err != nil {
		panic(err)
	}
	w.Write(data)
}
