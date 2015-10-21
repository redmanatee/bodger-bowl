/* @flow */
var Reflux = require('reflux');

module.exports = Reflux.createActions([
	"updateInjuries",
	"addActiveBond",
	"deleteActiveBond",
	"addPotentialBond",
	"deletePotentialBond",
	"incrementPotentialBond",
	"updatePlayerName",
	"updatePlayerFaction",
	"toggleStandin",
	"addGame",
	"updateGame",
	"userUpdateGame",
	"deleteGame",
	"addWeek",
	"updateWeek",
	"deleteWeek",
	"loadSeason",

	"viewMainTab",
	"viewWeek",
	"viewPlayerTab",
	"viewPlayer",
	"viewRenamedPlayer",
	"popHistoryState",
	
	"loadUser",
	"getUser",
	"redirectUrl"
]);
