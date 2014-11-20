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
    faction := "Skorne"
    player := Player {
    	Name: name,
    	Faction: faction,
    }
    players := make([]Player, 1)
    players[0] = player
	SavePlayers(c, nil, players)
	p := LoadPlayer(c, nil, name)
	if p == nil {
		t.Fatal("Loading player gave us a nil player")
	}
	if p.Name != name {
		t.Errorf("Expected player name to be '%s' not '%s'", name, p.Name)
	}
	if p.Faction != faction {
		t.Errorf("Expected player faction to be '%s' instead it was '%s'", faction, p.Faction)
	}
}

func TestPlayerCsvSaveNilSeason(t *testing.T) {
    csvString := `Player1,Skorne
Player2,Circle
`
	players := createPlayersFromCsv(csvString)
	if len(players) != 2 {
		t.Fatalf("Expected to get 2 players back from csv load, instead got '%d'", len(players))
	}
	p := players[0]
	if p.Name != "Player1" {
		t.Errorf("Expected player name to be '%s' not '%s'", "Player1", p.Name)
	}
	if p.Faction != "Skorne" {
		t.Errorf("Expected player faction to be '%s' instead it was '%s'", "Skorne", p.Faction)
	}

	p = players[1]
	if p.Name != "Player2" {
		t.Errorf("Expected player name to be '%s' not '%s'", "Player2", p.Name)
	}
	if p.Faction != "Circle" {
		t.Errorf("Expected player faction to be '%s' instead it was '%s'", "Circle", p.Faction)
	}

}
