package model

import (
	"testing"
    "appengine/aetest"
)

func TestSeasonSave(t *testing.T) {
	c, err := aetest.NewContext(nil)
    if err != nil {
            t.Fatal(err)
    }
    defer c.Close()
    s := LoadSeason(c, "Name", "Year")
    if s != nil {
    	t.Error("Expected to have a nil season with first lookup")
    }
    err = SaveSeason(c, "Name", "Year")
    if err != nil {
    	t.Fatalf("Error saving season: %v", err)
    }
    // Have to test this first, because the season GET from a key "forces" the put to stick in dev environment
    s = LoadSeason(c, "Name", "Year")
    if s == nil {
    	t.Fatal("Should not have had a nil Season")
    }
    if s.Name != "Name" {
    	t.Error("Expected Season to have an appropriate name")
    }
    if s.Year != "Year" {
    	t.Error("Expected Season to have an appropriate year")
    }
    if !s.Active {
    	t.Error("Expected Season to be active")
    }
    // Have to do this after a GET (see above) otherwise, in dev environment, the PUT is treated as not-committed yet
    s = LoadCurrentSeason(c)
    if s == nil {
    	t.Fatal("Should not have had a nil Season")
    }
    if s.Name != "Name" {
    	t.Error("Expected Season to have an appropriate name")
    }
    if s.Year != "Year" {
    	t.Error("Expected Season to have an appropriate year")
    }
    if !s.Active {
    	t.Error("Expected Season to be active")
    }
}
