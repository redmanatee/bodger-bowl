
window.seasonStore = Reflux.createStore({
	init: function() {
		var path = window.location.pathname.split('/');
		this.seasonId = path[path.length - 1];
		this.loadSeasonFromServer();
	},
	loadSeasonFromServer: function() {
		$.ajax({url:"/api/seasons/" + this.seasonId,
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
	loadSeason: function(season) {
		//setup player map lookup for quick lookup
		players = {};
		for (i = 0; i < season.Players.length; i++) {
			console.log(season.Players[i]);
			players[season.Players[i].Name] = season.Players[i];
		}
		console.log(players);
		// var lookupPlayer = function(playerId, i) {
		// 	return players[playerId];
		// };
		// //map the players to their divisions
		// for (i = 0; i < season.Conferences.length; i++) {
		// 	var conference = season.Conferences[i];
		// 	for (j = 0; j < conference.Divisions.length; j++) {
		// 		var division = conference.Divisions[j];
		// 		division.Players = $.map(division.PlayerIds, lookupPlayer);
		// 	}
		// }
		// //Map the players to their games
		// for (i = 0; i < season.Weeks.length; i++) {
		// 	var week = season.Weeks[i];
		// 	for (j = 0; j < week.Games.length; j++) {
		// 		var game = week.Games[j];
		// 		game.Players = $.map(game.Playerids, lookupPlayer);
		// 	}
		// }
		//Set the season to ourselves
		this.season = season;
		this.trigger(this.season);
	}
});
