package model

import (
	"testing"
	// "appengine"
    "appengine/aetest"
    // "log"
)

func TestSeasonSave(t *testing.T) {
	c, err := aetest.NewContext(nil)
    if err != nil {
            t.Fatal(err)
    }
    defer c.Close()
    s := LoadCurrentSeason(c)
    if s != nil {
    	t.Error("Expected to have a nil season with first lookup")
    }
    err = SaveSeason(c, "Name", "Year")
    if err != nil {
    	t.Fatalf("Error saving season: %v", err)
    }
    s = LoadCurrentSeason(c)
    if s == nil {
    	t.Error("Should not have had a nil Season")
    } else {
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
}
