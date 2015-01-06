package model

import (
	"appengine"
	"appengine/datastore"
	"math/rand"
	"strconv"
	"time"
)

func init() {
	rand.Seed(time.Now().UTC().UnixNano())	
}

func deactivateAllSeasons(c appengine.Context) {
	q := datastore.NewQuery("Season").Filter("Active =", true)
	var seasons []Season
	_, err := q.GetAll(c, &seasons)
	if err != nil {
		c.Errorf("Error attempting to get all Seasons from the datastore '%s'", err)
		panic(err)
	}
	for _, s := range seasons {
		s.Active = false
		SaveSeason(c, s)
	}
}

func generateWeekSchedule(playerPlayed map[string]map[string]bool, playersForScheduling [][][]string, schedule [5]int) []Game {
	games := make([]Game, len(playerPlayed)/2)
	count := 0
	unplayedCount := 0
	unplayed := make([]string, 6)
	for _, c := range playersForScheduling {
		for _, d := range c {
			games[count] = Game {
				PlayerIds: make([]string, 2),
				WinnerId: "",
			}
			player1Name := d[schedule[0]]
			player2Name := d[schedule[1]]
			games[count].PlayerIds[0] = player1Name
			games[count].PlayerIds[1] = player2Name
			playerPlayed[player1Name][player2Name] = true
			playerPlayed[player2Name][player1Name] = true
			count++
			games[count] = Game {
				PlayerIds: make([]string, 2),
				WinnerId: "",
			}
			player1Name = d[schedule[2]]
			player2Name = d[schedule[3]]
			games[count].PlayerIds[0] = player1Name
			games[count].PlayerIds[1] = player2Name
			playerPlayed[player1Name][player2Name] = true
			playerPlayed[player2Name][player1Name] = true
			count++
			unplayed[unplayedCount] = d[schedule[4]]
			unplayedCount++
		}
	}
	unplayed = shuffleStringArray(unplayed)
	for index := 0; index < len(unplayed); index += 2 {
		games[count] = Game{
			PlayerIds: make([]string, 2),
			WinnerId: "",
		}
		player1Name := unplayed[index]
		player2Name := unplayed[index+1]
		games[count].PlayerIds[0] = player1Name
		games[count].PlayerIds[1] = player2Name
		playerPlayed[player1Name][player2Name] = true
		playerPlayed[player2Name][player1Name] = true
		count++
	}
	return games
}

func gamesAreLegal(playerPlayed map[string]map[string]bool, players []string) bool {
	for index := 0; index < len(players); index+=2 {
		if playerPlayed[players[index]][players[index+1]] {
			return false
		}
	}
	return true
}

func generateRandomWeek(playerPlayed map[string]map[string]bool, players []string) []Game {
	games := make([]Game, len(playerPlayed)/2)
	players = shuffleStringArray(players)
	for !gamesAreLegal(playerPlayed, players) {
		players = shuffleStringArray(players)		
	}
	for index := 0; index < len(players); index+=2 {
		player1Name := players[index]
		player2Name := players[index+1]
		gameArr := make([]string, 2)
		gameArr[0] = player1Name
		gameArr[1] = player2Name
		games[index/2] = Game{
			PlayerIds: gameArr,
			WinnerId: "",
		}
		playerPlayed[player1Name][player2Name] = true
		playerPlayed[player2Name][player1Name] = true
	}	
	return games
}

// Creates the schedule and attaches it to the season entity passed in.  THIS IS HARD CODED RIGHT NOW
func generateSchedule(season *SeasonJson) {
	//TODO: this is hardcoded for now, because this is a hard problem!

	//Setup the shuffled players in their appropriate buckets
	playerPlayed := make(map[string]map[string]bool)
	playersForScheduling := make([][][]string, len(season.Conferences))
	for i, c := range season.Conferences {
		playersForScheduling[i] = make([][]string, len(c.Divisions))
		for j, d := range c.Divisions {
			playersForScheduling[i][j] = shuffleStringArray(d.PlayerIds)
			for _, p := range playersForScheduling[i][j] {
				playerPlayed[p] = make(map[string]bool)
			}
		}
	}
	players := make([]string, len(playerPlayed))
	count := 0
	for k := range playerPlayed {
		players[count] = k
		count++
	}

	//Week 1
	season.Weeks[0].Games = generateWeekSchedule(playerPlayed, playersForScheduling, [5]int{0, 1, 2, 3, 4})
	//Week 3
	season.Weeks[2].Games = generateWeekSchedule(playerPlayed, playersForScheduling, [5]int{0, 2, 4, 1, 3})
	//Week 5
	season.Weeks[4].Games = generateWeekSchedule(playerPlayed, playersForScheduling, [5]int{0, 4, 3, 1, 2})
	//Week 7
	season.Weeks[6].Games = generateWeekSchedule(playerPlayed, playersForScheduling, [5]int{4, 3, 1, 2, 0})
	//Week 8
	season.Weeks[7].Games = generateWeekSchedule(playerPlayed, playersForScheduling, [5]int{0, 3, 2, 4, 1})

	//Do the random weeks
	//Week 2
	season.Weeks[1].Games = generateRandomWeek(playerPlayed, players)
	//Week 4
	season.Weeks[3].Games = generateRandomWeek(playerPlayed, players)
	//Week 6
	season.Weeks[5].Games = generateRandomWeek(playerPlayed, players)
}

func shuffleStringArray(src []string) []string {
	result := make([]string, len(src))
	for i, v := range rand.Perm(len(src)) {
    	result[v] = src[i]
	}
	return result
}

// Creates and adds the divisions to the season entity passed in.
func generateDivisions(season *SeasonJson, conferenceCount int, divisionCount int) {
	for i := 0; i < conferenceCount; i++ {
		divisions := make([]Division, divisionCount)
		for j := 0; j < divisionCount; j++ {
			divisions[j] = Division {
				Name: "Division" + strconv.Itoa(j+1),
				PlayerIds: make([]string, 0),
			}
		}
		season.Conferences[i] = Conference {
			Name: "Conference " + strconv.Itoa(i+1),
			Divisions: divisions,
		}
	}
	playersOrdered := make([]PlayerJson, 0)
	playersFactioned := playersByFaction(season.Players)
	factions := make([]string, len(playersFactioned))
	i := 0
	for f, _ := range playersFactioned {
		factions[i] = f
		i++
	}
	factions = shuffleStringArray(factions)
	for _, f := range  factions {
		playersOrdered = append(playersOrdered, playersFactioned[f]...)
	}
	divisions := make([]*Division, conferenceCount * divisionCount)
	for d := 0; d < divisionCount; d++ {
		for c := 0; c < conferenceCount; c++ {
			divisions[c + (d * conferenceCount)] = &(season.Conferences[c].Divisions[d])
		}
	}
	for i, p := range playersOrdered {
		divisionIndex := i % len(divisions)
		divisions[divisionIndex].PlayerIds = append(divisions[divisionIndex].PlayerIds, p.Name)
		divisionIndex++
	}
}

// Creates a map of the players by faction.
func playersByFaction(players []PlayerJson) map[string][]PlayerJson {
	playersByFaction := make(map[string][]PlayerJson)
	for _, p := range players {
		playersByFaction[p.Faction] = append(playersByFaction[p.Faction], p)
	}
	return playersByFaction
}

// Creates a season for the passed in data and information.  This includes the conferences, divisions, players and schedule
func CreateSeason(c appengine.Context, name string, year string, conferenceCount int, divisionCount int, playersCsv string) {
	seasonJson := SeasonJson {
		Year: year,
		Name: name,
		Active: true,
		Conferences: make([]Conference, conferenceCount),
		Weeks: make([]Week, 8), //TODO: this is hardcoded for now, because scheduling is hard
		Players: createPlayersFromCsv(playersCsv),
	}
	deactivateAllSeasons(c)
	generateDivisions(&seasonJson, conferenceCount, divisionCount)
	generateSchedule(&seasonJson)
	season, players := CreateSeasonAndPlayers(c, seasonJson)
	SaveSeason(c, season)
	SavePlayers(c, &season, players)
}

