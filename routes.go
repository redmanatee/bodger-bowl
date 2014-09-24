package routes

import (
	"admin"
    "net/http"
)

func init() {
	http.HandleFunc("/admin/season", admin.SeasonHandler)
	http.HandleFunc("/admin/", admin.AdminHandler)
	http.HandleFunc("/admin/api/seasons/", admin.APISeasonHandler)
}
