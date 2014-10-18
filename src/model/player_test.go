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
    email := "player.name@somewhere.com"
    name := "Player Name"
    faction := "Skorne"
    phone := "503-244-6613"
    player := Player {
    	Name: name,
    	Email: email,
    	Faction: faction,
    	Phone: phone,
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
	if p.Email != email {
		t.Errorf("Expected player email to be '%s' instead it was '%s'", email, p.Email)
	}
	if p.Faction != faction {
		t.Errorf("Expected player faction to be '%s' instead it was '%s'", faction, p.Faction)
	}
	if p.Phone != phone {
		t.Errorf("Expected player phone number to be '%s' instead it was '%s'", phone, p.Phone)
	}
}

func TestPlayerCsvSaveNilSeason(t *testing.T) {
    csvString := `Player1,Skorne,player@somewhere.com,406-244-6613
Player2,Circle,player2@somewhereelse.com,
`
	players := createPlayersFromCsv(csvString)
	if len(players) != 2 {
		t.Fatalf("Expected to get 2 players back from csv load, instead got '%d'", len(players))
	}
	p := players[0]
	if p.Name != "Player1" {
		t.Errorf("Expected player name to be '%s' not '%s'", "Player1", p.Name)
	}
	if p.Email != "player@somewhere.com" {
		t.Errorf("Expected player email to be '%s' instead it was '%s'", "player@somewhere.com", p.Email)
	}
	if p.Faction != "Skorne" {
		t.Errorf("Expected player faction to be '%s' instead it was '%s'", "Skorne", p.Faction)
	}
	if p.Phone != "406-244-6613" {
		t.Errorf("Expected player phone number to be '%s' instead it was '%s'", "406-244-6613", p.Phone)
	}

	p = players[1]
	if p.Name != "Player2" {
		t.Errorf("Expected player name to be '%s' not '%s'", "Player2", p.Name)
	}
	if p.Email != "player2@somewhereelse.com" {
		t.Errorf("Expected player email to be '%s' instead it was '%s'", "player2@somewhereelse.com", p.Email)
	}
	if p.Faction != "Circle" {
		t.Errorf("Expected player faction to be '%s' instead it was '%s'", "Circle", p.Faction)
	}
	if p.Phone != "" {
		t.Errorf("Expected player phone to be '' instead it was '%s", p.Phone)
	}

}
