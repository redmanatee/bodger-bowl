/** @jsx React.DOM */

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
			<select onChange={this.props.onChangeFunction} value={this.props.selectedPlayer !== null? this.props.selectedPlayer.Name : ""}>
				<option disabled value="">Select a Player</option>
				{rows}
			</select>
		);
	}
});

var PlayerInjuries = React.createClass({
	updateData: function(event) {
		appActions.updateInjuries(this.props.player.Name, this.refs.injuryText.getDOMNode().value);
		this.refs.injuryText.getDOMNode().value = "";
	},
	render: function() {
		var rows = []
		if (this.props.player !== null && this.props.player.Injuries !== null && this.props.player.Injuries.length > 0) {
			this.props.player.Injuries.forEach(function(injury) {
				rows.push(
					<tr key={injury}><td>{injury}</td></tr>
				);
			});
		} else {
			rows.push(<tr key={0}><td>--None--</td></tr>)
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
		appActions.deleteActiveBond(this.props.bond.Warcaster,
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
		appActions.addActiveBond(warcasterName, warjackName, bondText, bondNumber, this.props.player.Name);
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
		if (bonds.length === 0) {
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
		//TODO: adding or deleting bonds
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
		appActions.deletePotentialBond(this.props.bond.Warcaster,
									   this.props.bond.Warjack,
									   this.props.bond.Bonus,
									   this.props.playerName);
	},
	incrementBond: function(event) {
		appActions.incrementPotentialBond(this.props.bond.Warcaster,
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
		appActions.addPotentialBond(warcasterName, warjackName, bonus, this.props.player.Name);
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
		if (bonds.length === 0) {
			bonds.push(
				<tr className="text-left" key={0}><td colSpan={this.props.admin? 4 : 3}>--None--</td></tr>
			);
		}
		var adminHeader = [];
		var editingPanel = []
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
		//TODO: adding or deleting bonds
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
			selectedPlayer: this.getSelectedPlayer(selectedPlayer.Name, data)
		});
	},
	getInitialState: function() {
		return {
			season: window.seasonStore.season,
			selectedPlayer: null,
		};
	},
	playerSelectionChange: function(event) {
		appActions.viewPlayer(event.target.value);
	},
	componentDidMount: function() {
		this.listenTo(window.seasonStore, this.onStatusChange);
		this.listenTo(window.viewPlayerStore, this.viewPlayer);
	},
	getSelectedPlayer: function(playerName, season) {
		for (var i = 0; i < this.state.season.Players.length; i++) {
			if (season.Players[i].Name === playerName) {
				return season.Players[i];
			}
		}
	},
	viewPlayer: function(playerName) {
		this.setState({ selectedPlayer: this.getSelectedPlayer(playerName, this.state.season) });
	},
	render: function() {
		var admin = this.props.admin;
		var players = [];
		var tabbedArea = <p>No player selected.</p>;
		if (this.state.season !== null) {
			players = this.state.season.Players;
		}
		if (this.state.selectedPlayer) {
			tabbedArea =
				<div>
					<PlayerCell player={this.state.selectedPlayer} noLink={true} />
					<TabbedArea defaultActiveKey={1}>
						<TabPane key={1} tab="Injuries">
							<PlayerInjuries player={this.state.selectedPlayer} admin={admin} />
						</TabPane>
						<TabPane key={2} tab="Bonds">
							<PlayerBonds player={this.state.selectedPlayer} admin={admin} />
						</TabPane>
						<TabPane key={3} tab="Potential Bonds">
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
