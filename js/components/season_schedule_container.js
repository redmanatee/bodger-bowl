/* @flow */
var React = require('react');
var AppActions = require('../actions.js');
var PlayerCell = require('./player_cell.js');
var Nav = require('react-bootstrap/Nav');
var Table = require('react-bootstrap/Table');
var Panel = require('react-bootstrap/Panel');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
var ButtonGroup = require('react-bootstrap/ButtonGroup');
var Button = require('react-bootstrap/Button');
var PageHeader = require('react-bootstrap/PageHeader');

var GameRow = React.createClass({
	propTypes: {
		weekNumber: React.PropTypes.number.isRequired,
		game: React.PropTypes.object.isRequired,
		admin: React.PropTypes.bool
	},
	handleChange: function(weekNumber, player1Name, player2Name) {
		return function(event) {
			AppActions.updateGame(weekNumber, player1Name, player2Name, event.target.value);
		};
	},
	render: function() {
		var game = this.props.game;
		var player1 = game.Players[0];
		var player2 = game.Players[1];
		var winner = game.Winner;
		var admin = this.props.admin;
		var winnerRow = <td><PlayerCell player={winner} admin={admin} /></td>;
		if (admin) {
			winnerRow = (
				<td>
					<select onChange={this.handleChange(this.props.weekNumber, player1.Name, player2.Name)}
						defaultValue={winner && winner.Name}>
							<option value="">-</option>
							<option value={player1.Name}>{player1.Name}</option>
							<option value={player2.Name}>{player2.Name}</option>
					</select>
				</td>
			);
		}
		return (
			<tr>
				<td><PlayerCell player={player1} admin={admin} /></td>
				<td><PlayerCell player={player2} admin={admin} /></td>
				{winnerRow}
			</tr>
		);
	}
});

var WeekTable = React.createClass({
	propTypes: {
		week: React.PropTypes.object.isRequired,
		admin: React.PropTypes.bool,
	},
	render: function() {
		var rows = this.props.week.Games.map(function(game, i) {
			return <GameRow game={game} weekNumber={this.props.week.Number} key={i} admin={this.props.admin} />;
		}.bind(this));
		return (
			<Table striped bordered hover>
				<thead className="text-left">
					<th>Player 1</th>
					<th>Player 2</th>
					<th>Winner</th>
				</thead>
				<tbody className="text-left">{rows}</tbody>
			</Table>
		);
	}
});

var WeekGroup = React.createClass({
	propTypes: {
		week: React.PropTypes.object.isRequired,
		admin: React.PropTypes.bool,
	},
	getInitialState: function() {
		return { showWeekEditor: false };
	},
	updateWeek: function(weekNumber) {
		return function(event) {
			AppActions.updateWeek(weekNumber, this.refs.playDate.getDOMNode().value, this.refs.scenarios.getDOMNode().value);
			this.hideEditor();
		}.bind(this);
	},
	componentDidUpdate: function(prevProps) {
		if(prevProps.week != this.props.week) this.hideEditor();
	},
	showEditor: function() {
		this.setState({showWeekEditor: true});
	},
	hideEditor: function() {
		this.setState({showWeekEditor: false});
	},
	scrollToSchedule: function() {
		this.refs.weekGroup.getDOMNode().scrollIntoView();
	},
	render: function() {
		var admin = this.props.admin;
		var number = this.props.week.Number;
		var weekEdit = "";
		function pad(number) {
			if (number < 10) {
				return '0' + number;
			}
			return number;
		}
		if(admin) {
			if(this.state.showWeekEditor) {
				var playDateId  = "play-date-" + number;
				var scenariosId = "scenarios-" + number;
				var dateDefault = "";
				var playDate = this.props.week.PlayDate;

				if(playDate) {
					playDate = new Date(playDate);
					dateDefault = playDate.getFullYear() + '-' + pad(playDate.getMonth() + 1) + '-' + pad(playDate.getDate());
				}
				weekEdit = (
					<Panel className="text-left">
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
						<Button onClick={this.hideEditor}>Cancel</Button>
						<Button onClick={this.updateWeek(number)}>Submit</Button>
					</Panel>
				);
			} else {
				weekEdit = <div id="edit-week-button"><Button onClick={this.showEditor}>Edit Week</Button></div>;
			}
		}
		return (
			<div ref="weekGroup">
				{weekEdit}
				<WeekTable week={this.props.week} admin={this.props.admin} />
			</div>
		);
	}
});

module.exports = React.createClass({
	propTypes: {
		season: React.PropTypes.object.isRequired,
		admin: React.PropTypes.bool,
		activeWeek: React.PropTypes.object,
	},
	// scroll to the schedule. useful when the schedule is below the button group, when the display width is small
	scrollToSchedule: function() {
		this.refs.weekGroup.scrollToSchedule();
	},
	render: function(): ?ReactElement {
		var admin = this.props.admin;
		var navButtons = this.props.season.Weeks.map(function(week) {
			var header = "Week " + week.Number;
			var playDateHtml = null;
			var scenariosHtml = null;
			var active = this.props.activeWeek == week;
			if(week.PlayDate)
				playDateHtml = <small><br />{new Date(week.PlayDate).toLocaleDateString()}</small>;
			if(week.Scenarios)
				scenariosHtml = <small><br />Scenarios: {week.Scenarios.join(", ")}</small>;
			return (
				<Button active={active} onClick={function() { AppActions.viewWeek(week.Number); }}>
					Week {header}
					{playDateHtml}
					{scenariosHtml}
				</Button>
			);
		}.bind(this));
		return (
			<div>
				<Row className="text-center">
					<PageHeader>{this.props.season.Name + " (" + this.props.season.Year + ")"}</PageHeader>
				</Row>
				<Row>
					<Col sm={2} xs={12}>
						<ButtonGroup vertical style={{width: "100%"}}>
							{navButtons}
						</ButtonGroup>
					</Col>
					<Col sm={10} xs={12}>
						<WeekGroup ref="weekGroup" week={this.props.activeWeek} admin={admin}  />
					</Col>
				</Row>
			</div>
		);
	}
});
