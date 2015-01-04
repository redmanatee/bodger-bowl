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
	"addWeek",
	"updateWeek",
	"loadSeason",

	"viewMainTab",
	"viewWeek",
	"viewPlayerTab",
	"viewPlayer",
	"viewRenamedPlayer",
	"popHistoryState",
]);
