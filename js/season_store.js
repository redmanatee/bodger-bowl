
var _weekly_scenarios = [["1", "2"], ["7", "8"], ["3", "4"], ["11", "12"], ["9", "10"], ["5", "6"], ["11", "12"], ["3", "4"]];

var _playerSort = function(a, b) {
	if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
		return -1;
	} else if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
		return 1;
	} else {
		return 0;
	}
};

var appActions = Reflux.createActions([
	"updateInjuries",
]);

window.seasonStore = Reflux.createStore({
	init: function() {
		this.season = null;
		this.refreshSeasonFromServer();
		this.listenTo(appActions.updateInjuries, this.updateInjuries);
	},
	refreshSeasonFromServer: function() {
		if (window.location.pathname === "/") {
			this.loadActiveSeasonFromServer();
		} else {
			var path = window.location.pathname.split('/');
			this.seasonId = path[path.length - 1];
			this.loadSeasonFromServer();
		}
	},
	updateInjuries: function(playerName, newInjuries) {
		console.log("update injuries called");
		$.ajax({url:"/admin/api/players/injuries/",
			type: 'POST',
			data: {
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Injuries: newInjuries,
			},
			success: function(data) {
				console.log("Injury update finished");
				this.refreshSeasonFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Injury update failed!");
				this.refreshSeasonFromServer();
  			}.bind(this)
		});
	},
	loadActiveSeasonFromServer: function() {
		$.ajax({url:"/api/seasons/latest/" + this.seasonId,
				type: 'GET',
				dataType: 'json',
				success: function(data) {
					this.loadSeason(data);
				}.bind(this),
				error: function(xhr, status, err) {
        			console.error(this.props.url, status, err.toString());
      			}.bind(this)
		});
	},
	loadSeasonFromServer: function() {
		$.ajax({url:"/api/seasons/" + this.seasonId,
				type: 'GET',
				dataType: 'json',
				success: function(data) {
					this.loadSeason(data);
				}.bind(this),
				error: function(xhr, status, err) {
        			this.loadActiveSeasonFromServer();
      			}.bind(this)
		});
	},
	loadSeason: function(season) {
		//setup player map lookup for quick lookup
		if (season !== null && season.Length === 1) {
			season = season[0];
		}
		if (season === null || season.Length === 0) {
			this.loadActiveSeasonFromServer();
			return;
		}
		season.Players.sort(_playerSort);
		players = {};
		for (i = 0; i < season.Players.length; i++) {
			players[season.Players[i].Name] = season.Players[i];
		}
		var lookupPlayer = function(playerId, i) {
			if (playerId in players) {
				return players[playerId];
			}
			return null;
		};
		//map the players to their divisions
		for (i = 0; i < season.Conferences.length; i++) {
			var conference = season.Conferences[i];
			for (j = 0; j < conference.Divisions.length; j++) {
				var division = conference.Divisions[j];
				division.Players = $.map(division.PlayerIds, lookupPlayer);
			}
		}
		//Map the players to their games
		for (i = 0; i < season.Weeks.length; i++) {
			var week = season.Weeks[i];
			week.Scenarios = _weekly_scenarios[i];
			for (j = 0; j < week.Games.length; j++) {
				var game = week.Games[j];
				game.Players = $.map(game.PlayerIds, lookupPlayer);
				game.Winner = lookupPlayer(game.WinnerId, 0);
			}
		}
		//Set the season to ourselves
		this.season = season;
		this.trigger(this.season);
	}
});
