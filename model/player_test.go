package model

import (
	"testing"
    "appengine/aetest"
)

func TestPlayerSaveNoSeason(t *testing.T) {
	c, err := aetest.NewContext(nil)
    if err != nil {
            t.Fatal(err)
    }
    defer c.Close()
    name := "Player Name"
    email := "player.name@somewhere.com"
    faction := "Skorne"
	err = SavePlayer(c, nil, name, email, faction)
	if err != nil {
		t.Fatalf("Error saving player: %v", err)
	}
	p := LoadPlayer(c, nil, email)
	if p == nil {
		t.Fatal("Loading player gave us a nil player")
	}
	if p.Name != name {
		t.Errorf("Expected player name to be '%s' not '%s'", name, p.Name)
	}
	if p.Email != email {
		t.Errorf("Expected player email to be '%s' instead it was '%s'", email, p.Email)
	}
	if p.Faction != faction {
		t.Errorf("Expected player faction to be '%s' instead it was '%s'", faction, p.Faction)
	}
}
