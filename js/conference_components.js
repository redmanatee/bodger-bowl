/** @jsx React.DOM */

var PlayerDivisionRow = React.createClass({
	render: function() {
		return (
			<tr>
				<PlayerCell player={this.props.player} admin={this.props.admin} />
				<td>{this.props.wins}</td>
				<td>{this.props.losses}</td>
				<td>{this.props.rank}</td>
			</tr>
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
			<table>
				<thead>
					<th colSpan="3">{this.props.division.Name}</th>
				</thead>
				<tbody>{rows}</tbody>
			</table>
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
			rows.push(<DivisionTable division={division}
									 admin={admin}
									 wins={wins}
									 losses={losses}/>);
		});
		return (
			<div>
			<table>
				<thead>
					<th colSpan={divisionCount}>{this.props.conference.Name}</th>
				</thead>
			</table>
			{rows}
			</div>
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
			divisions.push(<ConferenceTable conference={conference} wins={wins} losses={losses} admin={admin} />);
		});
		return (
			<div>
				{divisions}
			</div>
		);
	}
});


