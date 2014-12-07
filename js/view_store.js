// keeps track of what is being displayed for the main tab set, the player tab set, and the player select box
(function() {
	'use strict';

	var state = {mainTab: 1, playerTab: 1, playerName: null}

	window.viewStore = Reflux.createStore({
		init: function() {
			this.listenTo(window.appActions.viewMainTab, this.viewMainTab);
			this.listenTo(window.appActions.viewPlayerTab, this.viewPlayerTab);
			this.listenTo(window.appActions.viewPlayer, this.viewPlayer);
		},
		viewMainTab: function(key) {
			state.mainTab = key;
			this.trigger(state);
		},
		viewPlayerTab: function(key) {
			state.playerTab = key;
			this.trigger(state);
		},
		viewPlayer: function(playerName) {
			state.playerName = playerName;
			state.mainTab = 3;
			this.trigger(state);
		},
	});
})();
