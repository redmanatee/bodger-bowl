/** @jsx React.DOM */

var React = require('react');
var PlayerCell = require('./player_cell.js');
var Table = require('react-bootstrap/Table');
var Col = require('react-bootstrap/Col');
var PageHeader = require('react-bootstrap/PageHeader');
var Grid = require('react-bootstrap/Grid');
var Row = require('react-bootstrap/Row');

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

module.exports = React.createClass({
	propTypes: {
		season: React.PropTypes.object.isRequired
	},
	render: function() {
		if (this.props.season === null) {
			return (<div></div>);
		}
		var conferences = [];
		var admin = this.props.admin;
		this.props.season.Conferences.forEach(function(conference) {
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
