window.viewPlayerStore = Reflux.createStore({
	init: function() {
		this.listenTo(appActions.viewPlayer, this.viewPlayer);
	},
	viewPlayer: function(player) {
		this.trigger(player);
	}
});
