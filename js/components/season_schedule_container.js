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
		players: React.PropTypes.array.isRequired,
		weekNumber: React.PropTypes.number.isRequired,
		gameIndex: React.PropTypes.number,
		game: React.PropTypes.object,
		admin: React.PropTypes.bool,
		edit: React.PropTypes.bool
	},
	getInitialState: function() {
		var game = this.props.game;
		return {
			player1: game && game.Players[0] && game.Players[0].Name,
			player2: game && game.Players[1] && game.Players[1].Name,
			winner: game && game.Winner
		};
	},
	addGame: function(weekNumber, gameIndex, admin) {
		var winner = null;
		return function() {
			var player1Name = null;
			var player2Name = null;
			if(admin){
				player1Name = this.refs.player1.getDOMNode().value;
				player2Name = this.refs.player2.getDOMNode().value;
			} else {
				player1Name = this.state.player1;
				player2Name = this.state.player2;
			}
			var winnerNumber = this.refs.winner.getDOMNode().value;
			
			if(winnerNumber == 1)
				winner = player1Name;
			if(winnerNumber == 2)
				winner = player2Name;
				
			if(this.props.edit){
				if(admin) {
					AppActions.updateGame(weekNumber, gameIndex, player1Name, player2Name, winner);
				} else {
					AppActions.publicUpdateGame(weekNumber, gameIndex, player1Name, player2Name, winner);
				}
			} else {
				AppActions.addGame(weekNumber, player1Name, player2Name, winner);
			}
			
			this.setState({winner: winner});
		}.bind(this);
	},
	deleteGame: function(weekNumber, gameIndex) {
		return function() {
			if(confirm('Are you sure you want to delete this game?')) {
				AppActions.deleteGame(weekNumber, gameIndex);
			}
		};
	},
	submitDispute: function() {
		alert('TODO: submit dispute');
	},
	player1Change: function() {
		this.setState({player1: this.refs.player1.getDOMNode().value});
	},
	player2Change: function() {
		this.setState({player2: this.refs.player2.getDOMNode().value});
	},
	render: function() {
		var game = this.props.game;
		var player1 = game && game.Players[0];
		var player2 = game && game.Players[1];
		var winner = null;
		if(game && game.Winner) {
			if(game.Winner == player1)
				winner = 1;
			if(game.Winner == player2)
				winner = 2;
		}
		var isGameOwner = false;
		if(player1 && player2){
			if(player1.Email == this.props.userEmail || player2.Email == this.props.userEmail){
				isGameOwner = true;
			}
		}
		
		// For admin users
		var admin = this.props.admin;
		var player1Options = this.props.players.map(function(player) { return <option key={player.Name}>{player.Name}</option>; });
		var player2Options = this.props.players.map(function(player) { return <option key={player.Name}>{player.Name}</option>; });
		if (admin) {
			var deleteButton = null;
			if(game) {
					deleteButton = <Button onClick={this.deleteGame(this.props.weekNumber, this.props.gameIndex)} bsStyle="danger">Delete</Button>;
			}
			return (
				<tr className={game ? "" : "warning"}>
					<td>
						<select ref="player1" defaultValue={player1 && player1.Name} onChange={this.player1Change}>
							<option value="">-</option>
							{player1Options}
						</select>
					</td>
					<td>
						<select ref="player2" defaultValue={player2 && player2.Name} onChange={this.player2Change}>
							<option value="">-</option>
							{player2Options}
						</select>
					</td>
					<td>
						<select ref="winner" defaultValue={winner}>
							<option value="">-</option>
							<option value={1}>{this.state.player1 || "-"}</option>
							<option value={2}>{this.state.player2 || "-"}</option>
						</select>
					</td>
					<td className="game-buttons">
						<Button onClick={this.addGame(this.props.weekNumber, this.props.gameIndex, admin)} bsStyle={game ? "default" : "warning"}>
							{this.props.edit ? "Update" : "Add"}
						</Button>
						{deleteButton}
					</td>
				</tr>
			);
		}
		
		// For non-admin users
		var winnerMenu = null;
		var updateButton = null;
		if(isGameOwner){
			if(!this.state.winner){
				// Displays when a winner is not set yet
				winnerMenu = 
					<td>
						<select ref="winner" defaultValue={winner}>
							<option value="">-</option>
							<option value={1}>{this.state.player1 || "-"}</option>
							<option value={2}>{this.state.player2 || "-"}</option>
						</select>
					</td>;
					
				updateButton = 
					<td className="game-buttons">
						<Button onClick={this.addGame(this.props.weekNumber, this.props.gameIndex, admin)} bsStyle="primary">Submit Result</Button>
					</td>;
			} else {
				// Displays when a winner already exists
				winnerMenu = <td><PlayerCell player={this.state.winner} /></td>;
					
				updateButton = 
					<td className="game-buttons">
						<Button onClick={this.submitDispute()} bsStyle="warning">Dispute</Button>
					</td>;
			}
			
		} else {
			winnerMenu = <td><PlayerCell player={this.state.winner} /></td>;
		}
		return (
			<tr>
				<td><PlayerCell player={player1} /></td>
				<td><PlayerCell player={player2} /></td>
				{winnerMenu}
				{updateButton}
			</tr>
		);
	}
});

var WeekTable = React.createClass({
	propTypes: {
		players: React.PropTypes.array.isRequired,
		weekNumber: React.PropTypes.number.isRequired,
		week: React.PropTypes.object.isRequired,
		admin: React.PropTypes.bool,
	},
	render: function() {
		var rows = this.props.week.Games.map(function(game, i) {
			return <GameRow game={game}
				weekNumber={this.props.weekNumber}
				key={this.props.weekNumber + "-" + i + "-" + game.Players.join("-") + "-" + game.Winner}
				admin={this.props.admin}
				gameIndex={i}
				players={this.props.players}
				userEmail={this.props.userEmail}
				edit />;
		}.bind(this));
		var opsColumn = "";
		var addGameRow = "";
		if(this.props.admin) {
			opsColumn = <th></th>;
			addGameRow = <GameRow weekNumber={this.props.weekNumber} key="add" admin={this.props.admin} players={this.props.players} />;
		}
		return (
			<Table striped bordered hover>
				<thead className="text-left">
					<th>Player 1</th>
					<th>Player 2</th>
					<th>Winner</th>
					{opsColumn}
				</thead>
				<tbody className="text-left">
					{rows}
					{addGameRow}
				</tbody>
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
		players: React.PropTypes.array.isRequired,
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
	deleteWeek: function() {
		if(window.confirm("Are you sure you want to delete this week?")) {
			AppActions.deleteWeek(this.props.weekNumber);
			AppActions.viewWeek(1);
		}
	},
	scrollToSchedule: function() {
		this.refs.weekGroup.getDOMNode().scrollIntoView();
	},
	render: function() {
		var admin = this.props.admin;
		var weekEdit = null;
		if(admin) {
			if(this.state.showWeekEditor) {
				weekEdit = <WeekEditor week={this.props.week} cancelCallback={this.hideEditor} submitCallback={this.updateWeek(this.props.weekNumber)} />;
			} else {
				weekEdit = (
					<div id="week-buttons">
						<Button onClick={this.showEditor}>Edit Week</Button>
						<Button onClick={this.deleteWeek} bsStyle="danger">Delete Week</Button>
					</div>
				);
			}
		}
		return (
			<div ref="weekGroup">
				{weekEdit}
				<WeekTable week={this.props.week}
				weekNumber={this.props.weekNumber}
				admin={this.props.admin}
				players={this.props.players}
				userEmail={this.props.userEmail} />
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
			content = <WeekGroup ref="weekGroup" weekNumber={this.props.activeWeekNumber} week={activeWeek} admin={admin} players={this.props.season.Players} userEmail={this.props.userEmail} />;
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
