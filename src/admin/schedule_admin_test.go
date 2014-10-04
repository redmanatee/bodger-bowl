package admin

import (
	"testing"
	"model"
)

func TestPlayersByFactionEmptyList(t *testing.T) {
	players := make([]model.Player, 0)
	playersByFaction := playersByFaction(players)
	if len(playersByFaction) != 0 {
		t.Errorf("Expected an empty map of players by faction, instead had one of length '%i'", len(playersByFaction))
	}
}
