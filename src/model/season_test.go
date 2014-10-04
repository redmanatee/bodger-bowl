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
    ns := Season{
    	Name: "Name",
    	Year: "Year",
    	Active: true,
    }
    err = SaveSeason(c, ns)
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

    ns = Season{
    	Name: "New Name",
    	Year: "Year2",
    	Active: false,
    }
    err = SaveSeason(c, ns)
    if err != nil {
    	t.Fatalf("Error saving second season: %v", err)
    }
    s = LoadSeason(c, "New Name", "Year2")
    if s == nil {
    	t.Fatalf("Should have found the second season")
    }
    allSeasons := LoadAllSeasons(c)
    if len(allSeasons) != 2 {
    	t.Error("Did not find 2 seasons when loading all seasons, instead found %v", len(allSeasons))
    }
}
