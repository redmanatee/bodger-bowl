/** @jsx React.DOM */

var PlayerDivisionRow = React.createClass({
	render: function() {
		return (
			<ul className="small-block-grid-3">
				<PlayerCell player={this.props.player} admin={this.props.admin} />
				<li>{this.props.player.Wins}</li>
				<li>{this.props.player.Losses}</li>
			</ul>
		);
	}
});

var DivisionTable = React.createClass({
	render: function() {
		var rows = [];
		var admin = this.props.admin;
		this.props.division.Players.forEach(function(player) {
			rows.push(<PlayerDivisionRow player={player} 
										   rank={-1}
										   admin={admin} />);
		});
		return (
			<div>
				<ul className="small-block-grid-1">
					<li>{this.props.division.Name}</li>
				</ul>
				<ul className="small-block-grid-3">
					<li>Player</li>
					<li>Wins</li>
					<li>Losses</li>
				</ul>
				{rows}
			</div>
		);
	}
});

var ConferenceTable = React.createClass({
	render: function() {
		var divisionCount = this.props.conference.Divisions.length;
		var rows = [];
		var admin = this.props.admin;
		this.props.conference.Divisions.forEach(function(division) {
			rows.push(
				<li>
					<DivisionTable division={division}
									 admin={admin}/>
				</li>
			);
		});
		return (
			<ul className="small-block-grid-1">
				<li>{this.props.conference.Name}</li>
				<li>
					<ul className="small-block-grid-3">
						{rows}
					</ul>
				</li>
			</ul>
		);
	}
});

var ConferenceContainer = React.createClass({
	mixins: [Reflux.ListenerMixin],
	onSeasonChange: function(season) {
		this.setState({
			season:season
		});
	},
	getInitialState: function() {
		return {
			season: window.seasonStore.season,
		};
	},
	componentDidMount: function() {
		this.listenTo(window.seasonStore, this.onSeasonChange);
	},
	render: function() {
		if (this.state.season === null) {
			return (<div></div>);
		}
		var divisions = [];
		var admin = "true";
		this.state.season.Conferences.forEach(function(conference) {
			divisions.push(
				<li>
					<ConferenceTable conference={conference} admin={admin} />
				</li>
			);
		});
		return (
			<ul className="small-block-grid-1 text-center">
				{divisions}
			</ul>
		);
	}
});


