
window.seasonStore = Reflux.createStore({
	init: function() {
		this.season = null;
		if (window.location.pathname === "/") {
			this.loadActiveSeasonFromServer();
		} else {
			var path = window.location.pathname.split('/');
			this.seasonId = path[path.length - 1];
			this.loadSeasonFromServer();
		}
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
		if (season != null && season.Length === 1) {
			season = season[0];
		}
		if (season === null || season.Length === 0) {
			this.loadActiveSeasonFromServer();
			return;
		}
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

window.winStore = Reflux.createStore({
	init: function() {
		this.wins = {};
		this.listenTo(window.seasonStore, this.updateSeason);
		if (window.seasonStore.season != null) {
			this.updateSeason(window.seasonStore.season);
		}
	},
	updateSeason: function(season) {
		this.wins = {}
		for (i = 0; i < season.Weeks.length; i++) {
			var week = season.Weeks[i];
			for (j = 0; j < week.Games.length; j++) {
				winner = week.Games[j].Winner;
				if (winner != null) {
					if (!(winner.Name in this.wins)) {
						this.wins[winner.Name] = 0;
					}
					this.wins[winner.Name]++;
				}
			}
			this.trigger(this.wins);
		}
	}
});

window.lossStore = Reflux.createStore({
	init: function() {
		this.losses = {};
		this.listenTo(window.seasonStore, this.updateSeason);
		if (window.seasonStore.season != null) {
			this.updateSeason(window.seasonStore.season);
		}
	},
	updateSeason: function(season) {
		this.losses = {}
		for (i = 0; i < season.Weeks.length; i++) {
			var week = season.Weeks[i];
			for (j = 0; j < week.Games.length; j++) {
				winner = week.Games[j].Winner;
				if (winner != null) {
					loser = week.Games[j].Players[0];
					if (week.Games[j].Players[0].Name == winner.Name) {
						loser = week.Games[j].Players[1];
					}
					if (!(loser.Name in this.losses)) {
						this.losses[loser.Name] = 0;
					}
					this.losses[loser.Name]++;
				}
			}
			this.trigger(this.losses);
		}
	}
});


window.rankStore = Reflux.createStore({
});
