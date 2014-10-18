package admin

import (
    "net/http"
    "html/template"
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
		createSeason(w, r)
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
