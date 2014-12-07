// keeps track of what is being displayed for the main tab set, the player tab set, and the player select box
(function() {
	'use strict';

	var state = {mainTab: 1, playerTab: 1, playerName: null};

	var historyEnabled = window.history && window.history.pushState;
	if(historyEnabled) {
		window.onpopstate = window.appActions.popHistoryState;
		window.history.replaceState(state, '');
	}

	window.viewStore = Reflux.createStore({
		init: function() {
			this.listenTo(window.appActions.viewMainTab, this.viewMainTab);
			this.listenTo(window.appActions.viewPlayerTab, this.viewPlayerTab);
			this.listenTo(window.appActions.viewPlayer, this.viewPlayer);
			this.listenTo(window.appActions.popHistoryState, this.popHistoryState);
		},
		viewMainTab: function(key) {
			state.mainTab = key;
			if(historyEnabled) window.history.pushState(state, '');
			this.trigger(state);
		},
		viewPlayerTab: function(key) {
			state.playerTab = key;
			if(historyEnabled) window.history.pushState(state, '');
			this.trigger(state);
		},
		viewPlayer: function(playerName) {
			state.playerName = playerName;
			state.mainTab = 3;
			if(historyEnabled) window.history.pushState(state, '');
			this.trigger(state);
		},
		popHistoryState: function(event) {
			state = event.state;
			this.trigger(state);
		}
	});
})();
