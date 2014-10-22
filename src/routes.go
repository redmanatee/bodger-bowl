package routes

import (
	"admin"
	"api"
    "net/http"
    "html/template"
)

func init() {
	http.HandleFunc("/admin/seasons/", admin.SeasonHandler)
	http.HandleFunc("/admin/seasons/add", admin.AddSeasonHandler)
	http.HandleFunc("/admin/", admin.AdminHandler)
	http.HandleFunc("/api/seasons/", api.SeasonList)
	http.HandleFunc("/", HomeRequest)
	http.HandleFunc("/api/seasons/latest/", api.GetActiveSeason)
	http.HandleFunc("/admin/api/weeks/", admin.UpdateWeek)
	http.HandleFunc("/api/players/", api.GetPlayer)
	http.HandleFunc("/players/", PlayerRequest)
	http.HandleFunc("/admin/players/", admin.PlayerHandler)
	http.HandleFunc("/admin/api/players/injuries/", admin.PlayerInjuryUpdateHandler)
}

func HomeRequest(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/base.html", "templates/home_page.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}

}

func PlayerRequest(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/base.html", "templates/player_page.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}

}

