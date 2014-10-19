package admin

import (
	"api"
	"appengine"
	"encoding/json"
	"model"
	"net/http"
	"strconv"
	"strings"
)

func init() {
	
}

func createSeason(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	name := r.FormValue("name")
	year := r.FormValue("year")
	players := r.FormValue("players")
	conferenceCount, confErr := strconv.Atoi(r.FormValue("conferences"))
	if confErr != nil {
		c.Errorf("Error getting conference count: '%s'", confErr)
	}
	divisionCount, divErr := strconv.Atoi(r.FormValue("divisions"))
	if divErr != nil {
		c.Errorf("Error getting division count: '%s'", divErr)
	}
	if confErr == nil && divErr == nil {
		model.CreateSeason(c, name, year, conferenceCount, divisionCount, players)
	}
}

// Splits the game update data.
func splitGameUpdateData(c appengine.Context, data string) (weekNumber int, player1Name string, player2Name string, winnerName string) {
	dataArr := strings.Split(data, ":")
	weekNumber, err := strconv.Atoi(dataArr[0])
	if err != nil {
		panic(err)
	}

	return weekNumber, dataArr[1], dataArr[2], dataArr[3]
}

func updateWeekWinnings(c appengine.Context, weekData []byte, weekNumber int, player1Name string, player2Name string, winnerName string) ([]byte, string) {
	var weeks []model.Week
	err := json.Unmarshal(weekData, &weeks)
	if err != nil {
		panic(err)
	}
	weekIndex := weekNumber - 1
	var originalWinnerName string
	for index := 0; index < len(weeks[weekIndex].Games); index++ {
		game := &(weeks[weekIndex].Games[index])
		if game.PlayerIds[0] == player1Name || game.PlayerIds[1] == player1Name {
			c.Infof("Found a game that matches: '%v'", game)
			originalWinnerName = game.WinnerId
			if game.WinnerId == winnerName {
				c.Infof("No changes found - '%v' ==? '%v'", winnerName, game.WinnerId)
				return weekData, originalWinnerName
			}
			c.Infof("Looks different - '%v' !=? '%v'", winnerName, game.WinnerId)
			//else
			game.WinnerId = winnerName
			c.Infof("After updating the winner id: '%v'", game)
			c.Infof("After updating the winner id, the full week:\n%v", weeks[weekNumber])
			newData, err := json.Marshal(weeks)
			if err != nil {
				panic(err)
			}
			return newData, originalWinnerName
		}
	}
	return weekData, ""
}

// Handles update week API calls.
func UpdateWeek(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	seasonId := r.FormValue("SeasonId")
	c.Infof("Seasonid: %v", seasonId)
	updateData := r.FormValue("Data")
	c.Infof("data: %v", updateData)
	season := api.LoadSeasonById(c, seasonId)
	weekNumber, player1Name, player2Name, winnerName := splitGameUpdateData(c, updateData)
	updateWeekData, originalWinnerName := updateWeekWinnings(c, season.Schedule, weekNumber, player1Name, player2Name, winnerName)
	c.Infof("New Weekdata: \n\n'%v'\n\n", string(updateWeekData))
	c.Infof("Old Weekdata: \n\n'%v'\n\n", string(season.Schedule))
	season.Schedule = updateWeekData
	if originalWinnerName != winnerName {
		model.SaveSeason(c, *season)
		var playersToSave [2]model.Player
		if winnerName == "" {
			oldLoserName := player1Name
			if oldLoserName == originalWinnerName {
				oldLoserName = player2Name
			}
			playersToSave[0] = *model.LoadPlayer(c, season, originalWinnerName)
			playersToSave[1] = *model.LoadPlayer(c, season, oldLoserName)
			playersToSave[0].Wins -= 1
			playersToSave[1].Losses -= 1
		} else {
			loserName := player1Name
			if loserName == winnerName {
				loserName = player2Name
			}
			playersToSave[0] = *model.LoadPlayer(c, season, winnerName)
			playersToSave[1] = *model.LoadPlayer(c, season, loserName)
			playersToSave[0].Wins += 1
			playersToSave[1].Losses += 1
			if originalWinnerName != "" {
				playersToSave[0].Losses -= 1
				playersToSave[1].Wins -= 1
			}
		}
		model.SavePlayers(c, season, playersToSave[:])
	}
}
