/** @jsx React.DOM */

var SeasonData = React.createClass({
	mixins: [Reflux.ListenerMixin],
	getInitialState: function() {
		return {
			season: window.seasonStore.season,
			activeKey: 1,
			selectedPlayer: null,
			activePlayerTab: 1
		};
	},
	componentDidMount: function() {
		this.listenTo(window.viewStore, this.view);
		this.listenTo(window.seasonStore, this.onSeasonChange);
	},
	onSeasonChange: function(season) {
		this.setState({ season:season });
	},
	view: function(state) {
		this.setState({
			activeKey: state.mainTab,
			selectedPlayer: this.getPlayer(state.playerName),
			activePlayerTab: state.playerTab
		});
	},
	getPlayer: function(playerName) {
		for (var i = 0; i < this.state.season.Players.length; i++) {
			if (this.state.season.Players[i].Name === playerName) {
				return this.state.season.Players[i];
			}
		}
	},
	render: function() {
		var admin = $('#season-schedule').data('admin');
		var season = this.state.season;
		if(season) {
			return (
				<TabbedArea className="main-nav" activeKey={this.state.activeKey} justified onSelect={window.appActions.viewMainTab}>
					<TabPane key={1} tab="Season Schedule">
						<SeasonScheduleTable admin={admin} season={season} />
					</TabPane>
					<TabPane key={2} tab="Conferences">
						<ConferenceContainer admin={admin} season={season} />
					</TabPane>
					<TabPane key={3} tab="Players">
						<PlayerContainer admin={admin} season={season} selectedPlayerName={this.state.selectedPlayerName} activeTab={this.state.activePlayerTab} />
					</TabPane>
				</TabbedArea>
			);
		} else {
			return <h1>Loading Season Data</h1>;
		}
	},
});


$(function() {
	var schedule = $('#season-schedule')[0];
	if(schedule) React.renderComponent(<SeasonData />, schedule);
});
