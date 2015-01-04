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
		gameIndex: React.PropTypes.number.isRequired,
		admin: React.PropTypes.bool
	},
	handleChange: function(weekNumber, gameIndex) {
		return function(event) {
			AppActions.updateGame(weekNumber, gameIndex, event.target.value);
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
					<select onChange={this.handleChange(this.props.weekNumber, this.props.gameIndex)}
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
			return <GameRow game={game} weekNumber={this.props.weekNumber} key={i} admin={this.props.admin} gameIndex={i} />;
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

var WeekEditor = React.createClass({
	propTypes: {
		week: React.PropTypes.object,
		submitCallback: React.PropTypes.func.isRequired,
		cancelCallback: React.PropTypes.func,
	},
	updateWeek: function() {
		this.props.submitCallback(this.refs.playDate.getDOMNode().value, this.refs.scenarios.getDOMNode().value);
	},
	render: function() {
		var dateDefault = "";
		var cancelLink = this.props.cancelCallback && <span> <a onClick={this.props.cancelCallback}>Cancel</a></span>;
		var week = this.props.week;

		function pad(number) { return number < 10 ? '0' + number : number; }

		if(week) {
			var playDate = week.PlayDate;
			if(playDate) {
				playDate = new Date(playDate);
				dateDefault = playDate.getFullYear() + '-' + pad(playDate.getMonth() + 1) + '-' + pad(playDate.getDate());
			}
		}
		return (
			<Panel className="text-left">
				<div className="form-group">
					<label htmlFor="play-date">Play Date</label>
					<input id="play-date" className="form-control" type="date" ref="playDate" placeholder="YYYY-MM-DD"
						defaultValue={dateDefault}  />
				</div>
				<div className="form-group">
					<label htmlFor="scenarios">Scenarios (comma separated)</label>
					<input id="scenarios" className="form-control" type="text" ref="scenarios" pattern="((\d+)(,\d+)*)?"
						defaultValue={week && week.Scenarios && week.Scenarios.join(",")} />
				</div>
				<Button onClick={this.updateWeek}>Submit</Button>
				{cancelLink}
			</Panel>
		);
	}
});

var WeekGroup = React.createClass({
	propTypes: {
		weekNumber: React.PropTypes.number.isRequired,
		week: React.PropTypes.object.isRequired,
		admin: React.PropTypes.bool,
	},
	getInitialState: function() {
		return { showWeekEditor: false };
	},
	componentDidUpdate: function(prevProps) {
		if(prevProps.week != this.props.week) this.hideEditor();
	},
	updateWeek: function(weekNumber) {
		return function(playDate, scenarios) {
			AppActions.updateWeek(weekNumber, playDate, scenarios);
			this.hideEditor();
		}.bind(this);
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
		var weekEdit = "";
		if(admin) {
			if(this.state.showWeekEditor) {
				weekEdit = <WeekEditor week={this.props.week} cancelCallback={this.hideEditor} submitCallback={this.updateWeek(this.props.weekNumber)} />;
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
		activeWeekNumber: React.PropTypes.number.isRequired,
	},
	getInitialState: function() {
		return { showAddWeek: false };
	},
	// scroll to the schedule. useful when the schedule is below the button group, when the display width is small
	scrollToSchedule: function() {
		this.refs.weekGroup.scrollToSchedule();
	},
	viewWeek: function(weekNumber: number): Function {
		return function() {
			this.hideAddWeek();
			AppActions.viewWeek(weekNumber);
		}.bind(this);
	},
	showAddWeek: function() {
		this.setState({ showAddWeek: true });
	},
	hideAddWeek: function() {
		this.setState({ showAddWeek: false });
	},
	addWeek: function(playDate: string, scenarios: string) {
		AppActions.addWeek(playDate, scenarios);
		this.hideAddWeek();
	},
	render: function(): ?ReactElement {
		var activeWeek = this.props.season.Weeks[this.props.activeWeekNumber - 1];
		var admin = this.props.admin;
		var navButtons = this.props.season.Weeks.map(function(week, i) {
			var header = "Week " + (i+1);
			var playDateHtml = null;
			var scenariosHtml = null;
			var active = !this.state.showAddWeek && this.props.activeWeekNumber == i+1;
			if(week.PlayDate)
				playDateHtml = <small><br />{new Date(week.PlayDate).toLocaleDateString()}</small>;
			if(week.Scenarios)
				scenariosHtml = <small><br />Scenarios: {week.Scenarios.join(", ")}</small>;
			return (
				<Button active={active} onClick={this.viewWeek(i+1)}>
					Week {header}
					{playDateHtml}
					{scenariosHtml}
				</Button>
			);
		}.bind(this));
		var addWeekButton = "";
		if(admin) {
			addWeekButton = <Button onClick={this.showAddWeek}>Add Week</Button>;
		}
		var content;
		if(this.state.showAddWeek) {
			content = <div>
				<h2>Add Week</h2>
				<WeekEditor cancelCallback={this.hideAddWeek} submitCallback={this.addWeek} />
			</div>;
		} else {
			content = <WeekGroup ref="weekGroup" weekNumber={this.props.activeWeekNumber} week={activeWeek} admin={admin} />;
		}
		return (
			<div>
				<Row className="text-center">
					<PageHeader>{this.props.season.Name + " (" + this.props.season.Year + ")"}</PageHeader>
				</Row>
				<Row>
					<Col sm={2} xs={12}>
						<ButtonGroup vertical style={{width: "100%"}}>
							{navButtons}
							{addWeekButton}
						</ButtonGroup>
					</Col>
					<Col sm={10} xs={12}>
						{content}
					</Col>
				</Row>
			</div>
		);
	}
});
