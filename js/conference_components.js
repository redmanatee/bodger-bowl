/** @jsx React.DOM */

var PlayerDivisionRow = React.createClass({
	render: function() {
		return (
			<ul className="small-block-grid-4">
				<PlayerCell player={this.props.Player} admin={this.props.admin} />
				<li>{this.props.wins}</li>
				<li>{this.props.losses}</li>
				<li>{this.props.rank}</li>
			</ul>
		);
	}
});

var DivisionTable = React.createClass({
	render: function() {
		var rows = [];
		var admin = this.props.admin;
		var winDict = this.props.wins;
		var lossDict = this.props.losses;
		this.props.division.Players.forEach(function(player) {
			var wins = 0;
			var losses = 0;
			if (player.Name in winDict) {
				wins = winDict[player.Name];
			}
			if (player.Name in lossDict) {
				losses = lossDict[player.Name];
			}
			rows.push(<PlayerDivisionRow player={player} 
										   wins={wins}
										   losses={losses}
										   rank={-1}
										   admin={admin} />);
		});
		return (
			<div>
				<ul className="small-block-grid-1">
					<li>{this.props.division.Name}</li>
				</ul>
				<ul className="small-block-grid-4">
					<li>Player</li>
					<li>Wins</li>
					<li>Losses</li>
					<li>Rank</li>
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
		var wins = this.props.wins;
		var losses = this.props.losses;
		this.props.conference.Divisions.forEach(function(division) {
			rows.push(
				<li>
					<DivisionTable division={division}
									 admin={admin}
									 wins={wins}
									 losses={losses}/>
				</li>
			);
		});
		return (
			<ul className="small-block-grid-1 centered">
				<li>{this.props.conference.Name}</li>
				<li>
					<ul className="small-block-grid-1 medium-block-grid-2">
						{rows}
					</ul>
				</li>
			</ul>
		);
	}
});

var ConferenceContainer = React.createClass({
	mixins: [Reflux.ListenerMixin],
	onWinChange: function(wins) {
		this.setState({
			wins: wins
		});
	},
	onLossChange: function(losses) {
		this.setState({
			losses: losses
		});
	},
	onSeasonChange: function(season) {
		this.setState({
			season:season
		});
	},
	getInitialState: function() {
		return {
			season: window.seasonStore.season,
			wins: window.winStore.wins,
			losses: window.lossStore.losses
		};
	},
	componentDidMount: function() {
		this.listenTo(window.seasonStore, this.onSeasonChange);
		this.listenTo(window.winStore, this.onWinChange);
		this.listenTo(window.lossStore, this.onLossChange);
	},
	render: function() {
		if (this.state.season === null) {
			return (<div></div>);
		}
		var divisions = [];
		var admin = "true";
		var wins = this.state.wins;
		var losses = this.state.losses;
		this.state.season.Conferences.forEach(function(conference) {
			divisions.push(
				<li>
					<ConferenceTable conference={conference} wins={wins} losses={losses} admin={admin} />
				</li>
			);
		});
		return (
			<ul className="small-block-grid-1">
				{divisions}
			</ul>
		);
	}
});


