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
	"updateGame",
	"updateWeek",

	"viewMainTab",
	"viewWeek",
	"viewPlayerTab",
	"viewPlayer",
	"viewRenamedPlayer",
	"popHistoryState",
]);
