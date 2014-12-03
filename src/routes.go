package routes

import (
	"appengine"
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
	http.HandleFunc("/admin/api/players/setName", admin.SetPlayerName)
	http.HandleFunc("/api/players/", api.GetPlayer)
	http.HandleFunc("/admin/api/players/injuries/", admin.PlayerInjuryUpdateHandler)
	http.HandleFunc("/admin/api/players/bonds/add/", admin.PlayerBondAddHandler)
	http.HandleFunc("/admin/api/players/bonds/delete/", admin.PlayerBondDeleteHandler)
	http.HandleFunc("/admin/api/players/bonds/potential/add/", admin.PlayerPotentialBondAddHandler)
	http.HandleFunc("/admin/api/players/bonds/potential/delete/", admin.PlayerPotentialBondDeleteHandler)
	http.HandleFunc("/admin/api/players/bonds/potential/increment/", admin.PlayerPotentialBondIncrementHandler)
}

func HomeRequest(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	c.Infof("Home request")
	tmpl := template.Must(template.ParseFiles("templates/base.html", "templates/home_page.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}

}
