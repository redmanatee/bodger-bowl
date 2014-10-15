package admin

import (
    "net/http"
    "html/template"
    "strconv"
    "model"
    "appengine"
)

func init() {
}

func AdminHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/admin/admin_home.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}
}

func SeasonHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
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
	tmpl := template.Must(template.ParseFiles("templates/admin/admin_season.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}
}

func AddSeasonHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/admin/admin_create_season.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}	
}
