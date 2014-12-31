/** @jsx React.DOM */

var Season = React.createClass({
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
			var content = <SeasonScheduleContainer admin={admin} season={season} />;
			if (this.state.activeKey == 2)
				content = <ConferenceContainer admin={admin} season={season} />;
			if (this.state.activeKey == 3)
				content = <PlayerContainer admin={admin} season={season} selectedPlayer={this.state.selectedPlayer} activeTab={this.state.activePlayerTab} />;

			return (
				<div>
					<Navbar className="main-nav">
						<Nav>
							<NavItem className={this.state.activeKey == 1 ? "active" : ""}
									eventKey={1}
									onClick={function() { window.appActions.viewMainTab(1); }}>
								Season Schedule
							</NavItem>

							<NavItem className={this.state.activeKey == 2 ? "active" : ""}
									eventKey={2}
									onClick={function() { window.appActions.viewMainTab(2); }}>
								Conferences
							</NavItem>

							<NavItem className={this.state.activeKey == 3 ? "active" : ""}
									eventKey={3}
									onClick={function() { window.appActions.viewMainTab(3); }}>
								Players
							</NavItem>
						</Nav>
					</Navbar>
				{content}
				</div>
			);
		} else {
			return <h1>Loading Season Data</h1>;
		}
	},
});
