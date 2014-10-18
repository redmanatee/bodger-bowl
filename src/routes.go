package routes

import (
	"admin"
	"api"
    "net/http"
)

func init() {
	http.HandleFunc("/admin/seasons/", admin.SeasonHandler)
	http.HandleFunc("/admin/seasons/add", admin.AddSeasonHandler)
	http.HandleFunc("/admin/", admin.AdminHandler)
	http.HandleFunc("/api/seasons/", api.SeasonList)
}
