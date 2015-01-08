/* @flow */
var Reflux = require('reflux');
var AppActions = require('../actions.js');

// keeps track of what is being displayed for the main tab set, the player tab set, and the player select box
module.exports = Reflux.createStore({
	init: function() {
		this.state = {mainTab: 1, playerTab: 1, playerName: null, weekNumber: 1};
		this.historyEnabled = window.history && window.history.pushState;
		if(this.historyEnabled) {
			window.onpopstate = AppActions.popHistoryState;
			window.history.replaceState(this.state, '');
		}
		this.listenTo(AppActions.viewMainTab, this.viewMainTab);
		this.listenTo(AppActions.viewWeek, this.viewWeek);
		this.listenTo(AppActions.viewPlayerTab, this.viewPlayerTab);
		this.listenTo(AppActions.viewPlayer, this.viewPlayer);
		this.listenTo(AppActions.viewRenamedPlayer, this.viewRenamedPlayer);
		this.listenTo(AppActions.popHistoryState, this.popHistoryState);
	},
	viewMainTab: function(key) {
		this.state.mainTab = key;
		if(this.historyEnabled) window.history.pushState(this.state, '');
		this.trigger(this.state);
	},
	viewWeek: function(weekNumber) {
		this.state.weekNumber = weekNumber;
		if(this.historyEnabled) window.history.pushState(this.state, '');
		this.trigger(this.state);
	},
	viewPlayerTab: function(key) {
		this.state.playerTab = key;
		if(this.historyEnabled) window.history.pushState(this.state, '');
		this.trigger(this.state);
	},
	viewPlayer: function(playerName) {
		this.state.playerName = playerName;
		this.state.mainTab = 4;
		if(this.historyEnabled) window.history.pushState(this.state, '');
		this.trigger(this.state);
	},
	viewRenamedPlayer: function(oldName, newName) {
		var replace = this.state.playerName == oldName;
		this.state.playerName = newName;
		this.state.mainTab = 3;
		if(this.historyEnabled)
			if(replace)
				window.history.replaceState(this.state, '');
			else
				window.history.pushState(this.state, '');
		this.trigger(this.state);
	},
	popHistoryState: function(event) {
		if(event.state) {
			this.state = event.state;
			this.trigger(this.state);
		}
	}
});
