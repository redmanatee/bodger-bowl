package admin

import (
    "net/http"
    "html/template"
)

func init() {
}

func AdminHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("admin/admin_home.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}
}

func SeasonHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("admin/admin_season.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}
}
