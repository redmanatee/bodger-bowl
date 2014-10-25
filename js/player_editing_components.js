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
					defaultValue={this.props.selectedPlayer != null? this.props.selectedPlayer.Name : ""}>
						{rows}
			</select>
		);
	}
});

var PlayerInjuries = React.createClass({
	injuryValue: "",
	handleChange: function(event) {
		this.injuryValue = event.target.value;
	},
	updateData: function(event) {
		appActions.updateInjuries(this.props.player.Name, this.injuryValue);
	},
	render: function() {
		var rows = []
		if (this.props.player != null && this.props.player.Injuries != null && this.props.player.Injuries.length > 0) {
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
					<input type="text" onChange={this.handleChange} />
					<input type="button" onClick={this.updateData} value="Update" />
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

var PlayerBonds = React.createClass({
	render: function() {
		return (<div></div>);
	}
});

var PlayerEditorPanel = React.createClass({
	mixins: [Reflux.ListenerMixin],
	onStatusChange: function(data) {
		var selectedPlayer = this.state.selectedPlayer;
		if (selectedPlayer == null) {
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
			if (this.state.season.Players[i].Name == selectedPlayerName) {
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
		if (this.state.season != null) {
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
						<p>Potential Bonds</p>
					</TabPane>
				</TabbedArea>
			</div>
		);
	}
});
