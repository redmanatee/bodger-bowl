/* @flow */
var Reflux = require('reflux');
var AppActions = require('../actions.js');

function compareBy(func) {
	return function(a, b) {
		var a1 = func(a), b1 = func(b);
		if (a1 < b1)
			return -1;
		if (a1 > b1)
			return	1;
		return	0;
	};
}


var _playerSort = compareBy(function(p) { return p.Name.toLowerCase(); });

var _ActiveBondSort = function(a, b) {
	return compareBy(function(bond) { return bond.Warcaster.toLowerCase(); })(a, b) ||
		compareBy(function(bond) { return bond.Warjack.toLowerCase(); })(a, b) ||
		a.BondNumber - b.BondNumber;
};

var _PotentialBondSort = function(a, b) {
	return compareBy(function(potentialBond) { return potentialBond.Warcaster.toLowerCase(); })(a, b) ||
		compareBy(function(potentialBond) { return potentialBond.Warjack.toLowerCase(); })(a, b) ||
		a.Bonus - b.Bonus;
};

var _PLayerRankingSort = function(a, b) {
	return compareBy(function(player) { return -player.Wins; })(a, b) ||
		compareBy(function(player) { return player.Losses; })(a, b);
};


module.exports = Reflux.createStore({
	init: function() {
		this.season = null;
		this.listenTo(AppActions.updateInjuries, this.updateInjuries);
		this.listenTo(AppActions.addActiveBond, this.addActiveBond);
		this.listenTo(AppActions.deleteActiveBond, this.deleteActiveBond);
		this.listenTo(AppActions.addPotentialBond, this.addPotentialBond);
		this.listenTo(AppActions.deletePotentialBond, this.deletePotentialBond);
		this.listenTo(AppActions.incrementPotentialBond, this.incrementPotentialBond);
		this.listenTo(AppActions.updatePlayerName, this.updatePlayerName);
		this.listenTo(AppActions.updatePlayerFaction, this.updatePlayerFaction);
		this.listenTo(AppActions.toggleStandin, this.toggleStandin);
		this.listenTo(AppActions.updateGame, this.updateGame);
		this.listenTo(AppActions.addWeek, this.addWeek);
		this.listenTo(AppActions.updateWeek, this.updateWeek);
		this.listenTo(AppActions.loadSeason, this.refreshSeasonFromServer);
	},
	incrementPotentialBond: function(warcaster, warjack, bonus, playerName) {
		$.post("/admin/api/players/bonds/potential/increment/",
			{
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Warcaster: warcaster,
				Warjack: warjack,
				Bonus: bonus,
			})
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function() { alert("Potential Bond Incrementation Failed!"); });
	},
	deletePotentialBond: function(warcaster, warjack, bonus, playerName) {
		$.post("/admin/api/players/bonds/potential/delete/",
			{
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Warcaster: warcaster,
				Warjack: warjack,
				Bonus: bonus,
			})
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function() { alert("Potential Bond Deletion Failed!"); });
	},
	addPotentialBond: function(warcaster, warjack, bonus, playerName) {
		$.post("/admin/api/players/bonds/potential/add/",
			{
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Warcaster: warcaster,
				Warjack: warjack,
				Bonus: bonus,
			})
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function() { alert("Pontential Bond Addition Failed!"); });
	},
	deleteActiveBond: function(warcaster, warjack, bondNum, bondName, playerName) {
		$.post("/admin/api/players/bonds/delete/",
			{
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Warcaster: warcaster,
				Warjack: warjack,
				BondText: bondName,
				BondNumber: bondNum,
			})
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function() { alert("Bond Deletion Failed!"); });
	},
	addActiveBond: function(warcasterName, warjackName, bondText, bondNumber, playerName) {
		$.post("/admin/api/players/bonds/add/",
			{
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Warcaster: warcasterName,
				Warjack: warjackName,
				BondText: bondText,
				BondNumber: bondNumber,
			})
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function() { alert("Bond Addition Failed!"); });
	},
	updatePlayerName: function(oldPlayerName, newPlayerName) {
		$.post("/admin/api/players/setName",
			{
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				PlayerId: oldPlayerName,
				NewPlayerName: newPlayerName
			})
			.done(function() {
				this.refreshSeasonFromServer().success(function() { AppActions.viewRenamedPlayer(oldPlayerName, newPlayerName); });
			}.bind(this))
			.fail(function() {
				alert("Player Rename Failed!");
				this.refreshSeasonFromServer();
			}.bind(this));
	},
	updatePlayerFaction: function(player, newFaction) {
		$.post("/admin/api/players/setFaction",
			{
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				PlayerId: player.Name,
				NewFaction: newFaction
			})
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function() { alert("Player Faction Update Failed!"); });
	},
	toggleStandin: function(playerName) {
		$.post("/admin/api/players/toggleStandin",
			{
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				PlayerId: playerName,
			})
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function() { alert("Player Standin Update Failed!"); });
	},
	refreshSeasonFromServer: function() {
		if (window.location.pathname === "/") {
			return this.loadActiveSeasonFromServer();
		} else if(window.location.pathname !== "/admin/") {
			var path = window.location.pathname.split('/');
			this.seasonId = path[path.length - 1];
			return this.loadSeasonFromServer();
		}
	},
	updateInjuries: function(playerName, newInjuries) {
		$.post("/admin/api/players/injuries/",
			{
				SeasonName: this.season.Name,
				SeasonYear: this.season.Year,
				Player: playerName,
				Injuries: newInjuries,
			})
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function() { alert("Injury update failed!"); });
	},
	updateGame: function(weekNumber, player1Name, player2Name, winnerName) {
		// URL: /admin/api/seasons/SEASON/week/WEEK/games/PLAYER1/PLAYER2
		$.post("/admin/api/seasons/" + [this.seasonId].concat(["weeks", weekNumber, "games", player1Name, player2Name].map(encodeURIComponent)).join("/"),
			{ winnerName: winnerName })
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function(xhr, status, err) { alert("Winner selection failed!"); });
	},
	addWeek: function(playDate, scenarios) {
		console.log('addWeek');
		// URL: /admin/api/seasons/SEASON/weeks
		$.post("/admin/api/seasons/" + this.seasonId + "/weeks",
			   {
				playDate: playDate,
				scenarios: scenarios
			})
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function(xhr, status, err) { alert("Add week failed!"); });
	},
	updateWeek: function(weekNumber, playDate, scenarios) {
		// URL: /admin/api/seasons/SEASON/weeks/WEEK
		$.post("/admin/api/seasons/" + [this.seasonId, "weeks", weekNumber].join("/"),
			{
				playDate: playDate,
				scenarios: scenarios
			})
			.always(this.refreshSeasonFromServer.bind(this))
			.fail(function(xhr, status, err) { alert("Update week failed!"); });
	},
	loadActiveSeasonFromServer: function() {
		return $.get("/api/seasons/latest/" + this.seasonId, {}, null, 'json')
			.success(function(data) { this.loadSeason(data); }.bind(this))
			.fail(function(xhr, status, err) { console.error(this.props.url, status, err.toString()); }.bind(this));
	},
	loadSeasonFromServer: function() {
		return $.get("/api/seasons/" + this.seasonId, {}, null, 'json')
			.success(function(data) { this.loadSeason(data); }.bind(this))
			.fail(function(xhr, status, err) { this.loadActiveSeasonFromServer(); }.bind(this));
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
			if (player.Bonds) {
				if (player.Bonds.ActiveBonds) {
					player.Bonds.ActiveBonds.sort(_ActiveBondSort);
				}
				if (player.Bonds.PotentialBonds) {
					player.Bonds.PotentialBonds.sort(_PotentialBondSort);
				}
			}
		});
		var players = {};
		var i: number = 0, j: number = 0;
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
				division.Players.sort(_PLayerRankingSort);
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
