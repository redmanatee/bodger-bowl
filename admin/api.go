package admin

import (
	"net/http"
	"encoding/json"
	"model"
	"appengine"
	"log"
)

func init() {
	http.HandleFunc("/admin/api/seasons/", seasonList)
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
