package admin

import (
    "net/http"
    "html/template"
)

func init() {
    http.HandleFunc("/admin/", adminHandler)
}

func adminHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("admin/admin_home.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}
}
