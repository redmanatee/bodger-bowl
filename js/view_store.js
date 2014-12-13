// keeps track of what is being displayed for the main tab set, the player tab set, and the player select box
(function() {
	'use strict';
	window.viewStore = Reflux.createStore({
		init: function() {
			this.state = {mainTab: 1, playerTab: 1, playerName: null};
			this.historyEnabled = window.history && window.history.pushState;
			if(this.historyEnabled) {
				window.onpopstate = window.appActions.popHistoryState;
				window.history.replaceState(this.state, '');
			}
			this.listenTo(window.appActions.viewMainTab, this.viewMainTab);
			this.listenTo(window.appActions.viewPlayerTab, this.viewPlayerTab);
			this.listenTo(window.appActions.viewPlayer, this.viewPlayer);
			this.listenTo(window.appActions.viewRenamedPlayer, this.viewRenamedPlayer);
			this.listenTo(window.appActions.popHistoryState, this.popHistoryState);
		},
		viewMainTab: function(key) {
			this.state.mainTab = key;
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
			this.state.mainTab = 3;
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
			this.state = event.state;
			this.trigger(this.state);
		}
	});
})();
