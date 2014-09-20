package admin

import (
	"net/http"
	"encoding/json"
	"model"
	"appengine"
	"log"
)

func init() {
	http.HandleFunc("/admin/api/seasons/", seasonHandler)
}

func seasonHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		seasonList(w, r)
	} else if r.Method == "POST" {
		createSeason(w,r)
	}
}

func createSeason(w http.ResponseWriter, r *http.Request) {
}

func seasonList(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasons := model.LoadAllSeasons(c)
	data, err := json.MarshalIndent(seasons, "", "\t")
	if err != nil {
		log.Printf("Unexpected error marshalling seasons: %v", err)
		panic(err)
	}
	w.Write(data)
}
