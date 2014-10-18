package admin

import (
    "html/template"
    "net/http"
    "strings"
)

func init() {
}

func AdminHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		createSeason(w, r)
	}
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
	pathItems := strings.Split(r.URL.Path, "/")
	lastItem := pathItems[len(pathItems)-1]
	if lastItem == "" {
		AdminHandler(w, r)
	} else {
		tmpl := template.Must(template.ParseFiles("templates/admin/admin_season.html"))
		err := tmpl.Execute(w, nil)
		if err != nil {
			panic(err)
		}
	}
}

func AddSeasonHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/admin/admin_create_season.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}	
}
