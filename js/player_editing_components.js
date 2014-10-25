/** @jsx React.DOM */

var PlayerSelector = React.createClass({
	render: function() {
		var rows = [];
		this.props.players.forEach(function(player) {
			rows.push(
				<option value={player.Name} key={player.Name}>
					<PlayerCell player={player} table={false} />
				</option>
			);
		}.bind(this));
		return (
			<select onChange={this.props.onChangeFunction} 
					defaultValue={this.props.selectedPlayer !== null? this.props.selectedPlayer.Name : ""}>
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
	render: function() {
		deleteButton = [];
		if (this.props.admin) {
			deleteButton = (
				<td><Button bsStyle="danger" bsSize="xsmall">Delete</Button></td>
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
					<PlayerBondDetail bond={this.props.player.Bonds.ActiveBonds[i]} key={i} admin={this.props.admin} />
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
	render: function() {
		deleteButton = [];
		if (this.props.admin) {
			deleteButton = (
				<td><Button bsStyle="danger" bsSize="xsmall">Delete</Button></td>
			);
		}
		return (
			<tr>
				<td>{this.props.bond.Warcaster.Name}</td>
				<td>{this.props.bond.Warjack}</td>
				<td>{this.props.bond.Bonus}</td>
				{deleteButton}
			</tr>
		);
	}
});

var PlayerPotentialBonds = React.createClass({
	render: function() {
		var bonds = [];
		if (this.props.player !== null && this.props.player.Bonds !== null && this.props.player.Bonds.PotentialBonds !== null) {
			for (i = 0; i < this.props.player.Bonds.PotentialBonds.length; i++) {
				bonds.push(
					<PlayerPotentialBondDetail bond={this.props.player.Bonds.PotentialBonds[i]} key={i} admin={this.props.admin} />
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
					<td><input type="text" placeholder="Warcaster" /></td>
					<td><input type="text" placeholder="Warjack" /></td>
					<td><input type="number" placeholder="Bonus" /></td>
					<td><Button bsStyle="primary">Submit</Button></td>
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
			selectedPlayer: selectedPlayer,
		});
	},
	getInitialState: function() {
		return {
			season: window.seasonStore.season,
			selectedPlayer: null,
		};
	},
	playerSelectionChange: function(event) {
		var selectedPlayer = null;
		var selectedPlayerName = event.target.value;
		for (var i = 0; i < this.state.season.Players.length; i++) {
			if (this.state.season.Players[i].Name === selectedPlayerName) {
				selectedPlayer = this.state.season.Players[i];
				break;
			}
		}
		this.setState({
			selectedPlayer: selectedPlayer,
		});
	},
	componentDidMount: function() {
		this.listenTo(window.seasonStore, this.onStatusChange);
	},
	render: function() {
		var players = [];
		if (this.state.season !== null) {
			players = this.state.season.Players;
		}
		var admin = this.props.admin;
		return (
			<div>
				<PlayerSelector players={players} 
								selectedPlayer={this.state.selectedPlayer}
								onChangeFunction={this.playerSelectionChange} />
				<PlayerCell player={this.state.selectedPlayer} />
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
			</div>
		);
	}
});
