/* @flow */
var React = require('react');
var AppActions = require('../actions.js');
var PlayerCell = require('./player_cell.js');
var Nav = require('react-bootstrap/Nav');
var Table = require('react-bootstrap/Table');
var Panel = require('react-bootstrap/Panel');
var Grid = require('react-bootstrap/Grid');
var Row = require('react-bootstrap/Row');
var Accordion = require('react-bootstrap/Accordion');
var PageHeader = require('react-bootstrap/PageHeader');

var GameRow = React.createClass({
	handleChange: function(weekNumber, player1Name, player2Name) {
		return function(event) {
			AppActions.updateGame(weekNumber, player1Name, player2Name, event.target.value);
		};
	},
	render: function() {
		var winnerRow = (<td><PlayerCell player={this.props.winner} admin={this.props.admin} /></td>);
		if (this.props.admin && this.props.admin !== "false") {
			winnerRow = (
				<td>
					<select onChange={this.handleChange(this.props.week, this.props.player1.Name, this.props.player2.Name)}
						defaultValue={this.props.winner && this.props.winner.Name}>
							<option value="">-</option>
							<option value={this.props.player1.Name}>{this.props.player1.Name}</option>
							<option value={this.props.player2.Name}>{this.props.player2.Name}</option>
					</select>
				</td>
			);
		}
		return (
			<tr>
				<td><PlayerCell player={this.props.player1} admin={this.props.admin} /></td>
				<td><PlayerCell player={this.props.player2} admin={this.props.admin} /></td>
				{winnerRow}
			</tr>
		);
	}
});

var WeekGroup = React.createClass({
	updateWeek: function(weekNumber) {
		return function(event) {
			AppActions.updateWeek(weekNumber, this.refs.playDate.getDOMNode().value, this.refs.scenarios.getDOMNode().value);
		}.bind(this);
	},
	render: function() {
		var rows = [];
		var admin = this.props.admin;
		var number = this.props.week.Number;
		var count = 0;
		this.props.week.Games.forEach(function(game) {
			rows.push(
					<GameRow player1={game.Players[0]}
							   player2={game.Players[1]}
							   hasWinner={game.Winner !== null}
							   winner={game.Winner}
							   week={number}
							   key={count}
							   admin={admin} />
			);
			count++;
		});
		var weekEdit = "";
		function pad(number) {
			if (number < 10) {
				return '0' + number;
			}
			return number;
		}
		if(admin) {
			var playDateId  = "play-date-" + number;
			var scenariosId = "scenarios-" + number;
			var dateDefault = "";
			var playDate = this.props.week.PlayDate;

			if(playDate) {
				playDate = new Date(playDate);
				dateDefault = playDate.getFullYear() + '-' + pad(playDate.getMonth() + 1) + '-' + pad(playDate.getDate());
			}
			weekEdit = (
				<div className="text-left">
					<div className="form-group">
						<label htmlFor={playDateId}>Play Date</label>
						<input id={playDateId} className="form-control" type="date" ref="playDate" placeholder="YYYY-MM-DD"
							defaultValue={dateDefault}  />
					</div>
					<div className="form-group">
						<label htmlFor={scenariosId}>Scenarios (comma separated)</label>
						<input id={scenariosId} className="form-control" type="text" ref="scenarios" pattern="((\d+)(,\d+)*)?"
							defaultValue={this.props.week.Scenarios && this.props.week.Scenarios.join(",")} />
					</div>
					<button type="submit" className="btn btn-default" onClick={this.updateWeek(number)}>Submit</button>
				</div>
			);
		}
		return (
			<div>
				{weekEdit}
				<Table striped bordered hover>
					<thead className="text-left">
						<th>Player 1</th>
						<th>Player 2</th>
						<th>Winner</th>
					</thead>
					<tbody className="text-left">{rows}</tbody>
				</Table>
			</div>
		);
	}
});

module.exports = React.createClass({
	propTypes: {
		season: React.PropTypes.object.isRequired
	},
	render: function(): ?ReactElement {
		var admin = this.props.admin;
		var rows = this.props.season.Weeks.map(function(week) {
			var header = "Week " + week.Number;
			if(week.PlayDate)
				header += " (" + new Date(week.PlayDate).toLocaleDateString() + ")";
			if(week.Scenarios)
				header += " - Scenario Numbers: [" + week.Scenarios.join(", ") + "]";
			return(
					<Panel header={header} eventKey={week.Number}>
						<WeekGroup week={week} admin={admin} key={week.Number}/>
					</Panel>
			);
		});
		return (
			<div className="text-center">
				<Grid>
					<Row>
						<PageHeader>{this.props.season.Name + " (" + this.props.season.Year + ")"}</PageHeader>
					</Row>
					<Row>
						<Accordion>{rows}</Accordion>
					</Row>
				</Grid>
			</div>
		);
	}
});
