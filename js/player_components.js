/** @jsx React.DOM */

var PlayerCell = React.createClass({
	render: function() {
		var img = (<div></div>);
		var player = (<div>--</div>);
		if (this.props.player !== null) {
			img = (<img className="faction text-left" src={"/img/" + this.props.player.Faction + ".jpg"} alt={"(" + this.props.player.Faction + ")"} title={this.props.player.Faction}/>);
			var name = this.props.player.Name;
			if(this.props.noLink) {
				player = <span>{this.props.player.Name}</span>;
			} else {
				player = <a onClick={function() { window.appActions.viewPlayer(name); }}>{this.props.player.Name}</a>;
			}
		}
		return (
			<div>
				{img}
				{player}
			</div>
		);
	}
});

var PlayerSchedule = React.createClass({
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
			<Grid>
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
			</Grid>
		);
	}
});

var PlayerSelector = React.createClass({
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
			<select onChange={this.props.onChangeFunction} value={this.props.selectedPlayer? this.props.selectedPlayer.Name : ""}>
				<option disabled value="">Select a Player</option>
				{rows}
			</select>
		);
	}
});

var PlayerInjuries = React.createClass({
	updateData: function(event) {
		window.appActions.updateInjuries(this.props.player.Name, this.refs.injuryText.getDOMNode().value);
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
			<Grid>
				<Row>
					<Col xs={this.props.admin? 6 : 12}>
						<Table striped bordered condensed hover>
							<thead><th>Injuries</th></thead>
							<tbody>{rows}</tbody>
						</Table>
					</Col>
					{adminCols}
				</Row>
			</Grid>
		);
	}
});

var PlayerBondDetail = React.createClass({
	deleteBond: function(event) {
		window.appActions.deleteActiveBond(this.props.bond.Warcaster,
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
		window.appActions.addActiveBond(warcasterName, warjackName, bondText, bondNumber, this.props.player.Name);
		this.refs.warcasterInput.getDOMNode().value = "";
		this.refs.warjackInput.getDOMNode().value = "";
		this.refs.bondNameInput.getDOMNode().value = "";
		this.refs.bondNumberInput.getDOMNode().value = "";
	},
	render: function() {
		var bonds = [];
		if (this.props.player !== null && this.props.player.Bonds !== null && this.props.player.Bonds.ActiveBonds !== null) {
			for (i = 0; i < this.props.player.Bonds.ActiveBonds.length; i++) {
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
		adminHeader = [];
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
			<Grid>
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
			</Grid>
		);
	}
});

var PlayerPotentialBondDetail = React.createClass({
	deleteBond: function(event) {
		window.appActions.deletePotentialBond(this.props.bond.Warcaster,
									   this.props.bond.Warjack,
									   this.props.bond.Bonus,
									   this.props.playerName);
	},
	incrementBond: function(event) {
		window.appActions.incrementPotentialBond(this.props.bond.Warcaster,
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
		window.appActions.addPotentialBond(warcasterName, warjackName, bonus, this.props.player.Name);
		this.refs.warcasterPotential.getDOMNode().value = "";
		this.refs.warjackPotential.getDOMNode().value = "";
		this.refs.bonusPotential.getDOMNode().value = "";
	},
	render: function() {
		var bonds = [];
		if (this.props.player !== null && this.props.player.Bonds !== null && this.props.player.Bonds.PotentialBonds !== null) {
			for (i = 0; i < this.props.player.Bonds.PotentialBonds.length; i++) {
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
			<Grid>
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
			</Grid>
		);
	}
});

var PlayerEditorPanel = React.createClass({
	mixins: [Reflux.ListenerMixin],
	onStatusChange: function(data) {
		var selectedPlayer = this.state.selectedPlayer;
		if (selectedPlayer === null) {
			selectedPlayer = data.Players[0];
		}
		this.setState({
			season: data,
			selectedPlayer: selectedPlayer && this.getSelectedPlayer(selectedPlayer.Name, data)
		});
	},
	getInitialState: function() {
		return {
			activeKey: 1,
			season: window.seasonStore.season,
			selectedPlayer: null,
		};
	},
	playerSelectionChange: function(event) {
		window.appActions.viewPlayer(event.target.value);
	},
	componentDidMount: function() {
		this.listenTo(window.seasonStore, this.onStatusChange);
		this.listenTo(window.viewStore,   this.view);
	},
	getSelectedPlayer: function(playerName, season) {
		if (!this.state.season) return null;
		for (var i = 0; i < this.state.season.Players.length; i++) {
			if (season.Players[i].Name === playerName) {
				return season.Players[i];
			}
		}
	},
	view: function(viewState) {
		this.setState({
			selectedPlayer: this.getSelectedPlayer(viewState.playerName, this.state.season),
			activeKey: viewState.playerTab
		});
	},
	updateName: function() {
		newName = prompt('Enter new name', this.state.selectedPlayer.Name);
		if (newName && newName !== this.state.selectedPlayer.Name) {
			window.appActions.updatePlayerName(this.state.selectedPlayer.Name, newName);
		}
	},
	updateFaction: function() {
		newFaction = prompt('Enter new faction', this.state.selectedPlayer.Faction);
		if (newFaction && newFaction !== this.state.selectedPlayer.Faction) {
			window.appActions.updatePlayerFaction(this.state.selectedPlayer, newFaction);
		}
	},
	toggleStandin: function() {
		window.appActions.toggleStandin(this.state.selectedPlayer.Name);
	},
	render: function() {
		var admin = this.props.admin;
		var players = [];
		var tabbedArea = <p>No player selected.</p>;
		if (this.state.season !== null) {
			players = this.state.season.Players;
		}
		if (this.state.selectedPlayer) {
			var playerEditing = [];
			if (admin) {
				playerEditing =
					<div>
						<Button bsStyle="primary" onClick={this.updateName}>Update Name</Button>
						<Button bsStyle="primary" onClick={this.updateFaction}>Update Faction</Button>
						<Button bsStyle="primary" onClick={this.toggleStandin}>Toggle Standin</Button>
						<div>{this.state.selectedPlayer && this.state.selectedPlayer.Standin? "Standin" : "Full Player"}</div>
					</div>;
			}
			tabbedArea =
				<div>
					<PlayerCell player={this.state.selectedPlayer} noLink={true} />
					{playerEditing}
					<TabbedArea activeKey={this.state.activeKey} onSelect={window.appActions.viewPlayerTab}>
						<TabPane key={1} tab="Schedule">
							<PlayerSchedule player={this.state.selectedPlayer} season={this.state.season} />
						</TabPane>
						<TabPane key={2} tab="Injuries">
							<PlayerInjuries player={this.state.selectedPlayer} admin={admin} />
						</TabPane>
						<TabPane key={3} tab="Bonds">
							<PlayerBonds player={this.state.selectedPlayer} admin={admin} />
						</TabPane>
						<TabPane key={4} tab="Potential Bonds">
							<PlayerPotentialBonds player={this.state.selectedPlayer} admin={admin} />
						</TabPane>
					</TabbedArea>
				</div>;
		}

		return (
			<Grid id="player-info">
				<Row>
					<PlayerSelector players={players}
									selectedPlayer={this.state.selectedPlayer}
									onChangeFunction={this.playerSelectionChange} />
					{tabbedArea}
				</Row>
			</Grid>
		);
	}
});
