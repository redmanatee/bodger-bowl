var React = require('react');
var Reflux = require('reflux');
var Navbar = require('react-bootstrap/Navbar');
var NavItem = require('react-bootstrap/NavItem');
var Nav = require('react-bootstrap/Nav');
var ViewStore = require('../stores/view.js');
var SeasonStore = require('../stores/season.js');
var AppActions = require('../actions.js');
var SeasonScheduleContainer = require('./season_schedule_container.js');
var ConferenceContainer = require('./conference_container.js');
var PlayerContainer = require('./player_container.js');

module.exports = React.createClass({
	mixins: [Reflux.ListenerMixin],
	getInitialState: function() {
		return {
			season: SeasonStore.season,
			activeKey: 1,
			selectedPlayer: null,
			activePlayerTab: 1
		};
	},
	componentDidMount: function() {
		this.listenTo(ViewStore, this.view);
		this.listenTo(SeasonStore, this.onSeasonChange);
	},
	onSeasonChange: function(season) {
		this.setState({ season: season });
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
									onClick={function() { AppActions.viewMainTab(1); }}>
								Season Schedule
							</NavItem>

							<NavItem className={this.state.activeKey == 2 ? "active" : ""}
									eventKey={2}
									onClick={function() { AppActions.viewMainTab(2); }}>
								Conferences
							</NavItem>

							<NavItem className={this.state.activeKey == 3 ? "active" : ""}
									eventKey={3}
									onClick={function() { AppActions.viewMainTab(3); }}>
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
