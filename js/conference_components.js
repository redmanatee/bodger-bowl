/** @jsx React.DOM */

var PlayerDivisionRow = React.createClass({
	render: function() {
		return (
			<tr>
				<PlayerCell player={this.props.player} admin={this.props.admin} />
				<td>{this.props.player.Wins}</td>
				<td>{this.props.player.Losses}</td>
			</tr>
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
				<div>{this.props.division.Name}</div>
				<table striped bordered hover >
					<thead>
						<th>Player</th>
						<th>Wins</th>
						<th>Losses</th>
					</thead>
					<tbody>{rows}</tbody>
				</table>
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


