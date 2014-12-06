
var _weekly_scenarios = [["1", "2"], ["7", "8"], ["3", "4"], ["11", "12"], ["9", "10"], ["5", "6"], ["11", "12"], ["3", "4"]];

var _weekly_dates = ["October 22, 2014", "October 29, 2014", "November 5, 2014", "November 12, 2014", "November 19, 2014", "December 3, 2014", "December 10, 2014", "December 17, 2014"];


function compareBy(func) {
	return function(a, b) {
		var a1 = func(a), b1 = func(b)
		if (a1 < b1)
			return -1;
		if (a1 > b1)
			return	1;
		return	0;
	}
}


var _playerSort = compareBy(function(p) { return p.Name.toLowerCase(); });


var _ActiveBondSort = function(a, b) {
	return compareBy(function(bond) { return bond.Warcaster.toLowerCase() })(a, b) ||
		compareBy(function(bond) { return bond.Warjack.toLowerCase() })(a, b) ||
		a.BondNumber - b.BondNumber;
}


var _PotentialBondSort = function(a, b) {
	return compareBy(function(potentialBond) { return potentialBond.Warcaster.toLowerCase() })(a, b) ||
		compareBy(function(potentialBond) { return potentialBond.Warjack.toLowerCase() })(a, b) ||
		a.Bonus - b.Bonus;
}


var appActions = Reflux.createActions([
	"updateInjuries",
	"addActiveBond",
	"deleteActiveBond",
	"addPotentialBond",
	"deletePotentialBond",
	"incrementPotentialBond",
	"viewPlayer",
	"updatePlayerName",
	"updatePlayerFaction",
	"toggleStandin",
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
		this.listenTo(appActions.updatePlayerName, this.updatePlayerName);
		this.listenTo(appActions.updatePlayerFaction, this.updatePlayerFaction);
		this.listenTo(appActions.toggleStandin, this.toggleStandin);
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
				this.refreshSeasonFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Bond Addition Failed!");
				this.refreshSeasonFromServer();
			}.bind(this)
		});
	},
	updatePlayerName: function(oldPlayerName, newPlayerName) {
		$.ajax({url:"/admin/api/players/setName",
			type: 'POST',
			data: {
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				PlayerId: oldPlayerName,
				NewPlayerName: newPlayerName
			},
			success: function(data) {
				this.refreshSeasonFromServer().success(function() { appActions.viewPlayer(newPlayerName); });
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Player Rename Failed!");
				this.refreshSeasonFromServer();
			}.bind(this)
		});
	},
	updatePlayerFaction: function(player, newFaction) {
		$.ajax({url:"/admin/api/players/setFaction",
			type: 'POST',
			data: {
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				PlayerId: player.Name,
				NewFaction: newFaction
			},
			success: function(data) {
				this.refreshSeasonFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Player Faction Update Failed!");
				this.refreshSeasonFromServer();
			}.bind(this)
		});
	},
	toggleStandin: function(playerName) {
		console.log("Toggle standin called");
		$.ajax({url:"/admin/api/players/toggleStandin",
			type: 'POST',
			data: {
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				PlayerId: playerName,
			},
			success: function(data) {
				this.refreshSeasonFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Player Standin Update Failed!");
				this.refreshSeasonFromServer();
			}.bind(this)
		});
	},
	refreshSeasonFromServer: function() {
		if (window.location.pathname === "/") {
			return this.loadActiveSeasonFromServer();
		} else {
			var path = window.location.pathname.split('/');
			this.seasonId = path[path.length - 1];
			return this.loadSeasonFromServer();
		}
	},
	updateInjuries: function(playerName, newInjuries) {
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
		return $.ajax({url:"/api/seasons/latest/" + this.seasonId,
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
		return $.ajax({url:"/api/seasons/" + this.seasonId,
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
