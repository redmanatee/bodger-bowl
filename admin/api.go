package admin

import (
	"net/http"
	"encoding/json"
	"model"
	"appengine"
	"log"
	// "io/ioutil"
)

func init() {
	http.HandleFunc("/admin/api/seasons/", seasonHandler)
}

func seasonHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		createSeason(w,r)
	}
	seasonList(w, r)
}

func createSeason(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	decoder := json.NewDecoder(r.Body)
	var s model.Season
	err :=  decoder.Decode(&s) 
	if err != nil {
		log.Printf("Unexpected error decoding json data: %v", err)
		panic(err)
	}
	err = model.SaveSeason(c, s)
	if err != nil {
		log.Printf("Unexpected error saving season: %v", err)
		panic(err)
	}
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
