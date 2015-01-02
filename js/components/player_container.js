/* @flow */
var React = require('react');
var AppActions = require('../actions.js');
var PlayerCell = require('./player_cell.js');
var Grid = require('react-bootstrap/Grid');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
var Table = require('react-bootstrap/Table');
var Button = require('react-bootstrap/Button');
var TabbedArea = require('react-bootstrap/TabbedArea');
var TabPane = require('react-bootstrap/TabPane');

var PlayerSchedule = React.createClass({
	propTypes: {
		season: React.PropTypes.object.isRequired
	},
	render: function() {
		var rows = [];
		var player = this.props.player;
		if (!player) {
			return <p>No data found</p>;
		} else {
			this.props.season.Weeks.forEach(function(week, weekIndex) {
				var weekRows = [];
				var weekText = week.Number;
				if(week.PlayDate) weekText += " (" + new Date(week.PlayDate).toLocaleDateString() + ")";
				var scenarios = week.Scenarios && week.Scenarios.join(", ");
				week.Games.forEach(function(game) {
					if(game.PlayerIds.indexOf(player.Name) != -1) {
						var opponent = game.Players.filter(function(p) { return p.Name != player.Name; })[0];
						weekRows.push(<tr key={weekIndex}><td>{weekText}</td><td><PlayerCell player={opponent} /></td><td>{scenarios}</td><td>{game.WinnerId}</td></tr>);
					}
				});
				if(!weekRows.length) {
					weekRows = [<tr key={0}><td>{weekText}</td><td>Bye</td><td>{scenarios}</td><td>{player.Name}</td></tr>];
				}
				rows = rows.concat(weekRows);
			});
		}
		return (
			<Row>
				<Col xs={12}>
					<Table striped bordered condensed hover>
						<thead>
							<tr>
								<td>Week</td>
								<td>Opponent</td>
								<td>Scenario</td>
								<td>Winner</td>
							</tr>
						</thead>
						<tbody>
							{rows}
						</tbody>
					</Table>
				</Col>
			</Row>
		);
	}
});

var PlayerSelector = React.createClass({
	playerSelectionChange: function(event) {
		AppActions.viewPlayer(this.refs.selectedPlayer.getDOMNode().value);
	},
	render: function() {
		var rows = [];
		this.props.players.forEach(function(player) {
			rows.push(
				<option value={player.Name} key={player.Name}>
					{player.Name}
				</option>
			);
		}.bind(this));
		return (
			<select ref="selectedPlayer" onChange={this.playerSelectionChange} value={this.props.selectedPlayer? this.props.selectedPlayer.Name : ""}>
				<option disabled value="">Select a Player</option>
				{rows}
			</select>
		);
	}
});

var PlayerInjuries = React.createClass({
	updateData: function(event) {
		AppActions.updateInjuries(this.props.player.Name, this.refs.injuryText.getDOMNode().value);
		this.refs.injuryText.getDOMNode().value = "";
	},
	render: function() {
		var rows = [];
		if (this.props.player !== null && this.props.player.Injuries !== null && this.props.player.Injuries.length > 0) {
			this.props.player.Injuries.forEach(function(injury) {
				rows.push(<tr key={injury}><td>{injury}</td></tr>);
			});
		} else {
			rows.push(<tr key={0}><td>--None--</td></tr>);
		}
		var adminCols = [];
		if (this.props.admin) {
			adminCols = (
				<Col >
					<input type="text" ref="injuryText" />
					<Button bsStyle="primary" onClick={this.updateData}>Update</Button>
				</Col>
			);
		}
		return (
			<Row>
				<Col xs={this.props.admin? 6 : 12}>
					<Table striped bordered condensed hover>
						<thead><th>Injuries</th></thead>
						<tbody>{rows}</tbody>
					</Table>
				</Col>
				{adminCols}
			</Row>
		);
	}
});

var PlayerBondDetail = React.createClass({
	deleteBond: function(event) {
		AppActions.deleteActiveBond(this.props.bond.Warcaster,
									this.props.bond.Warjack,
									this.props.bond.BondNumber,
									this.props.bond.BondName,
									this.props.playerName);
	},
	render: function() {
		var deleteButton = [];
		if (this.props.admin) {
			deleteButton = (
				<td><Button bsStyle="danger" bsSize="xsmall" onClick={this.deleteBond}>Delete</Button></td>
			);
		}
		return (
			<tr>
				<td>{this.props.bond.Warcaster}</td>
				<td>{this.props.bond.Warjack}</td>
				<td>{this.props.bond.BondName}</td>
				<td>{this.props.bond.BondNumber}</td>
				{deleteButton}
			</tr>
		);
	}
});

var PlayerBonds = React.createClass({
	submitBond: function(event) {
		var warcasterName = this.refs.warcasterInput.getDOMNode().value;
		var warjackName = this.refs.warjackInput.getDOMNode().value;
		var bondText = this.refs.bondNameInput.getDOMNode().value;
		var bondNumber = this.refs.bondNumberInput.getDOMNode().value;
		AppActions.addActiveBond(warcasterName, warjackName, bondText, bondNumber, this.props.player.Name);
		this.refs.warcasterInput.getDOMNode().value = "";
		this.refs.warjackInput.getDOMNode().value = "";
		this.refs.bondNameInput.getDOMNode().value = "";
		this.refs.bondNumberInput.getDOMNode().value = "";
	},
	render: function() {
		var bonds = [];
		if (this.props.player !== null && this.props.player.Bonds !== null && this.props.player.Bonds.ActiveBonds !== null) {
			for (var i = 0; i < this.props.player.Bonds.ActiveBonds.length; i++) {
				bonds.push(
					<PlayerBondDetail bond={this.props.player.Bonds.ActiveBonds[i]} playerName={this.props.player.Name} key={i} admin={this.props.admin} />
				);
			}
		}
		if (!bonds.length) {
			bonds.push(
				<tr className="text-left" key={0}><td colSpan={this.props.admin? 5 : 4}>--None--</td></tr>
			);
		}
		var editingPanel = [];
		var adminHeader = [];
		if (this.props.admin) {
			adminHeader = (
				<th>Delete?</th>
			);
			editingPanel = (
				<tr>
					<td><input type="text" ref="warcasterInput" placeholder="Warcaster" /></td>
					<td><input type="text" ref="warjackInput" placeholder="Warjack" /></td>
					<td><input type="Text" ref="bondNameInput" placeholder="Bond Name" /></td>
					<td><input type="number" ref="bondNumberInput" placeholder="Number" /></td>
					<td><Button bsStyle="primary" onClick={this.submitBond}>Submit</Button></td>
				</tr>
			);
		}
		return (
			<Row>
				<Col xs={this.props.admin? 6 : 12}>
					<Table striped bordered hover >
						<thead>
							<th>Warcaster/Warlock</th>
							<th>Warjack/Warbeast</th>
							<th>Bond Name</th>
							<th>Bond Number</th>
							{adminHeader}
						</thead>
						<tbody>
							{bonds}
							{editingPanel}
						</tbody>
					</Table>
				</Col>
			</Row>
		);
	}
});

var PlayerPotentialBondDetail = React.createClass({
	deleteBond: function(event) {
		AppActions.deletePotentialBond(this.props.bond.Warcaster,
									   this.props.bond.Warjack,
									   this.props.bond.Bonus,
									   this.props.playerName);
	},
	incrementBond: function(event) {
		AppActions.incrementPotentialBond(this.props.bond.Warcaster,
									   this.props.bond.Warjack,
									   this.props.bond.Bonus,
									   this.props.playerName);
	},
	render: function() {
		var deleteButton = [];
		var incrementButton = [];
		if (this.props.admin) {
			deleteButton = (
				<td><Button bsStyle="danger" bsSize="xsmall" onClick={this.deleteBond}>Delete</Button></td>
			);
			incrementButton = (
				<Button bsSize="xsmall" onClick={this.incrementBond}>+</Button>
			);
		}
		return (
			<tr>
				<td>{this.props.bond.Warcaster}</td>
				<td>{this.props.bond.Warjack}</td>
				<td>{this.props.bond.Bonus}{incrementButton}</td>
				{deleteButton}
			</tr>
		);
	}
});

var PlayerPotentialBonds = React.createClass({
	submitBond: function(event) {
		var warcasterName = this.refs.warcasterPotential.getDOMNode().value;
		var warjackName = this.refs.warjackPotential.getDOMNode().value;
		var bonus = this.refs.bonusPotential.getDOMNode().value;
		AppActions.addPotentialBond(warcasterName, warjackName, bonus, this.props.player.Name);
		this.refs.warcasterPotential.getDOMNode().value = "";
		this.refs.warjackPotential.getDOMNode().value = "";
		this.refs.bonusPotential.getDOMNode().value = "";
	},
	render: function() {
		var bonds = [];
		if (this.props.player !== null && this.props.player.Bonds !== null && this.props.player.Bonds.PotentialBonds !== null) {
			for (var i = 0; i < this.props.player.Bonds.PotentialBonds.length; i++) {
				bonds.push(
					<PlayerPotentialBondDetail bond={this.props.player.Bonds.PotentialBonds[i]} key={i} admin={this.props.admin} playerName={this.props.player.Name}/>
				);
			}
		}
		if (!bonds.length) {
			bonds.push(
				<tr className="text-left" key={0}><td colSpan={this.props.admin? 4 : 3}>--None--</td></tr>
			);
		}
		var adminHeader = [];
		var editingPanel = [];
		if (this.props.admin) {
			adminHeader = (
				<th>Delete?</th>
			);
			editingPanel = (
				<tr>
					<td><input type="text" ref="warcasterPotential" placeholder="Warcaster" /></td>
					<td><input type="text" ref="warjackPotential" placeholder="Warjack" /></td>
					<td><input type="number" ref="bonusPotential" placeholder="Bonus" /></td>
					<td><Button bsStyle="primary" onClick={this.submitBond}>Submit</Button></td>
				</tr>
			);
		}
		return (
			<Row>
				<Col xs={12}>
					<Table striped bordered hover >
						<thead>
							<th>Warcaster/Warlock</th>
							<th>Warjack/Warbeast</th>
							<th>Bonus</th>
							{adminHeader}
						</thead>
						<tbody>
							{bonds}
							{editingPanel}
						</tbody>
					</Table>
				</Col>
			</Row>
		);
	}
});

var PlayerInfo = React.createClass({
	propTypes: {
		season: React.PropTypes.object.isRequired,
		selectedPlayer: React.PropTypes.object.isRequired,
		activeTab: React.PropTypes.number,
		admin: React.PropTypes.bool
	},
	updateName: function() {
		var oldName = this.props.selectedPlayer.Name;
		var newName = prompt('Enter new name', oldName);
		if (newName && newName !== oldName) {
			AppActions.updatePlayerName(oldName, newName);
		}
	},
	updateFaction: function() {
		var newFaction = prompt('Enter new faction', this.props.selectedPlayer.Faction);
		if (newFaction && newFaction !== this.props.selectedPlayer.Faction) {
			AppActions.updatePlayerFaction(this.props.selectedPlayer, newFaction);
		}
	},
	toggleStandin: function() {
		AppActions.toggleStandin(this.props.selectedPlayer.Name);
	},
	render: function() {
		var admin = this.props.admin;
		var playerEditing = [];
		if (admin) {
			playerEditing =
				<div>
					<Button bsStyle="primary" onClick={this.updateName}>Update Name</Button>
					<Button bsStyle="primary" onClick={this.updateFaction}>Update Faction</Button>
					<Button bsStyle="primary" onClick={this.toggleStandin}>Toggle Standin</Button>
					<div>{this.props.selectedPlayer && this.props.selectedPlayer.Standin? "Standin" : "Full Player"}</div>
				</div>;
		}
		return (
			<div>
				<PlayerCell player={this.props.selectedPlayer} noLink={true} />
				{playerEditing}
				<TabbedArea activeKey={this.props.activeTab} onSelect={AppActions.viewPlayerTab}>
					<TabPane eventKey={1} tab="Schedule">
						<PlayerSchedule player={this.props.selectedPlayer} season={this.props.season} />
					</TabPane>
					<TabPane eventKey={2} tab="Injuries">
						<PlayerInjuries player={this.props.selectedPlayer} admin={admin} />
					</TabPane>
					<TabPane eventKey={3} tab="Bonds">
						<PlayerBonds player={this.props.selectedPlayer} admin={admin} />
					</TabPane>
					<TabPane eventKey={4} tab="Potential Bonds">
						<PlayerPotentialBonds player={this.props.selectedPlayer} admin={admin} />
					</TabPane>
				</TabbedArea>
			</div>
		);
	}
});

module.exports = React.createClass({
	propTypes: {
		season: React.PropTypes.object.isRequired,
		selectedPlayer: React.PropTypes.object,
		activeTab: React.PropTypes.number,
		admin: React.PropTypes.bool
	},
	getDefaultProps: function() { return { activeTab: 1 }; },
	render: function() {
		var players = this.props.season.Players;
		var playerInfo = this.props.selectedPlayer ?
			<PlayerInfo season={this.props.season} selectedPlayer={this.props.selectedPlayer} activeTab={this.props.activeTab} admin={this.props.admin} /> :
			<p>No player selected.</p>;

		return (
			<Grid id="player-info" fluid>
				<Row>
					<PlayerSelector players={players} selectedPlayer={this.props.selectedPlayer} />
					{playerInfo}
				</Row>
			</Grid>
		);
	}
});
