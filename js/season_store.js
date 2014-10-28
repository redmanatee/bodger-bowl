
var _weekly_scenarios = [["1", "2"], ["7", "8"], ["3", "4"], ["11", "12"], ["9", "10"], ["5", "6"], ["11", "12"], ["3", "4"]];

var _weekly_dates = ["October 22, 2014", "October 29, 2014", "November 5, 2014", "November 12, 2014", "November 19, 2014", "December 3, 2014", "December 10, 2014", "December 17, 2014"];

var _playerSort = function(a, b) {
	if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
		return -1;
	} else if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
		return 1;
	} else {
		return 0;
	}
};
var _ActiveBondSort = function(a, b) {
	if (a.Warcaster.toLowerCase() < b.Warcaster.toLowerCase()) {
		return -1;
	} else if (a.Warcaster.toLowerCase() > b.Warcaster.toLowerCase()) {
		return 1;
	} else if (a.Warjack.toLowerCase() < b.Warjack.toLowerCase()) {
		return -1;
	} else if (a.Warjack.toLowerCase() > b.Warjack.toLowerCase()) {
		return 1;
	} else if (a.BondNumber < b.BondNumber) {
		return -1;
	} else if (a.BondNumber > b.BondNumber) {
		return 1;
	} else {
		return 0;
	}
}

var _PotentialBondSort = function(a, b) {
	if (a.Warcaster.toLowerCase() < b.Warcaster.toLowerCase()) {
		return -1;
	} else if (a.Warcaster.toLowerCase() > b.Warcaster.toLowerCase()) {
		return 1;
	} else if (a.Warjack.toLowerCase() < b.Warjack.toLowerCase()) {
		return -1;
	} else if (a.Warjack.toLowerCase() > b.Warjack.toLowerCase()) {
		return 1;
	} else if (a.Bonus < b.Bonus) {
		return -1;
	} else if (a.Bonus > b.Bonus) {
		return 1;
	} else {
		return 0;
	}
}


var appActions = Reflux.createActions([
	"updateInjuries",
	"addActiveBond",
	"deleteActiveBond",
	"addPotentialBond",
	"deletePotentialBond",
	"incrementPotentialBond",
]);

window.seasonStore = Reflux.createStore({
	init: function() {
		this.season = null;
		this.refreshSeasonFromServer();
		this.listenTo(appActions.updateInjuries, this.updateInjuries);
		this.listenTo(appActions.addActiveBond, this.addActiveBond);
		this.listenTo(appActions.deleteActiveBond, this.deleteActiveBond);
		this.listenTo(appActions.addPotentialBond, this.addPotentialBond);
		this.listenTo(appActions.deletePotentialBond, this.deletePotentialBond);
		this.listenTo(appActions.incrementPotentialBond, this.incrementPotentialBond);
	},
	incrementPotentialBond: function(warcaster, warjack, bonus, playerName) {
		$.ajax({url:"/admin/api/players/bonds/potential/increment/",
			type: 'POST',
			data: {
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Warcaster: warcaster,
				Warjack: warjack,
				Bonus: bonus,
			},
			success: function(data) {
				this.refreshSeasonFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Bond Deletion Failed!");
				this.refreshSeasonFromServer();
  			}.bind(this)
		});
	},
	deletePotentialBond: function(warcaster, warjack, bonus, playerName) {
		$.ajax({url:"/admin/api/players/bonds/potential/delete/",
			type: 'POST',
			data: {
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Warcaster: warcaster,
				Warjack: warjack,
				Bonus: bonus,
			},
			success: function(data) {
				this.refreshSeasonFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Bond Deletion Failed!");
				this.refreshSeasonFromServer();
  			}.bind(this)
		});
	},
	addPotentialBond: function(warcaster, warjack, bonus, playerName) {
		$.ajax({url:"/admin/api/players/bonds/potential/add/",
			type: 'POST',
			data: {
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Warcaster: warcaster,
				Warjack: warjack,
				Bonus: bonus,
			},
			success: function(data) {
				this.refreshSeasonFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Bond Deletion Failed!");
				this.refreshSeasonFromServer();
  			}.bind(this)
		});
	},
	deleteActiveBond: function(warcaster, warjack, bondNum, bondName, playerName) {
		$.ajax({url:"/admin/api/players/bonds/delete/",
			type: 'POST',
			data: {
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Warcaster: warcaster,
				Warjack: warjack,
				BondText: bondName,
				BondNumber: bondNum,
			},
			success: function(data) {
				this.refreshSeasonFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Bond Deletion Failed!");
				this.refreshSeasonFromServer();
  			}.bind(this)
		});
	},
	addActiveBond: function(warcasterName, warjackName, bondText, bondNumber, playerName) {
		$.ajax({url:"/admin/api/players/bonds/add/",
			type: 'POST',
			data: {
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Warcaster: warcasterName,
				Warjack: warjackName,
				BondText: bondText,
				BondNumber: bondNumber,
			},
			success: function(data) {
				console.log("Bond addition finished");
				this.refreshSeasonFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Bond Addition Failed!");
				this.refreshSeasonFromServer();
  			}.bind(this)
		});
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
		season.Players.forEach(function(player) {
			if (player.Bonds != null) {
				if (player.Bonds.ActiveBonds != null) {
					player.Bonds.ActiveBonds.sort(_ActiveBondSort);
				}
				if (player.Bonds.PotentialBonds != null) {
					player.Bonds.PotentialBonds.sort(_PotentialBondSort);
				}
			}
		});
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
			week.PlayDate = _weekly_dates[i];
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
