package admin

import (
	"model"
)

// Creates and saves the season schedule as passed in.
func CreateSeasonSchedule(season *model.Season, conferenceCount int, divisionCount int, weeksCount int, playoffs int, players []model.Player) {

}

// Creates the season conferences, placing them on the modified season entity.  Note that this does NOT save the conferences or the entity.
func CreateConferences(season *model.Season, conferenceCount int, divisionCount int, players []model.Player) {
	
}


// Creates a map of the players by faction.
func playersByFaction(players []model.Player) map[string][]model.Player {
	playersByFaction := make(map[string][]model.Player)
	for _, p := range players {
		playersByFaction[p.Faction] = append(playersByFaction[p.Faction], p)
	}
	return playersByFaction
}
