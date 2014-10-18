package admin

import (
	"appengine"
	"net/http"
	"model"
	"strconv"
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
