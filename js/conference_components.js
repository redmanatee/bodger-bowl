/** @jsx React.DOM */

var PlayerDivisionRow = React.createClass({
	render: function() {
		return (
			<tr>
				<td><PlayerCell player={this.props.player} admin={this.props.admin} /></td>
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
										   key={player.Name}
										   admin={admin} />);
		});
		return (
			<div>
				<h2>{this.props.division.Name}</h2>
				<Table striped bordered hover >
					<thead className="text-left">
						<th>Player</th>
						<th>Wins</th>
						<th>Losses</th>
					</thead>
					<tbody className="text-left">{rows}</tbody>
				</Table>
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
				<Col xs={12} md={4} key={division.Name}><DivisionTable division={division} admin={admin}/></Col>
			);
		});
		return (
			<div>
				<PageHeader>{this.props.conference.Name}</PageHeader>
				<Grid>
					<Row>{rows}</Row>
				</Grid>
			</div>
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
		var conferences = [];
		var admin = this.props.admin;
		this.state.season.Conferences.forEach(function(conference) {
			conferences.push(
				<ConferenceTable conference={conference} admin={admin} key={conference.Name} />
			);
		});
		return (
			<div className="text-center">
				{conferences}
			</div>
		);
	}
});


