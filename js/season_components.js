/** @jsx React.DOM */

var PlayerCell = React.createClass({
	render: function() {
		var img = (<div></div>);
		var player = (<div>--</div>);
		if (this.props.player !== null) {
			img = (<img className="faction text-left" src={"/img/" + this.props.player.Faction + ".jpg"} alt={"(" + this.props.player.Faction + ")"} title={this.props.player.Faction}/>)
			var name = this.props.player.Name
			if(this.props.noLink) {
				player = <span>{this.props.player.Name}</span>;
			} else {
				player = <a onClick={function() { window.appActions.viewPlayer(name) }}>{this.props.player.Name}</a>;
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

var GameRow = React.createClass({
	handleChange: function(weekNumber, player1Name, player2Name) {
		return function(event) {
			window.appActions.updateGame(weekNumber, player1Name, player2Name, event.target.value);
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

var SeasonScheduleTable = React.createClass({
	mixins: [Reflux.ListenerMixin],
	onStatusChange: function(data) {
		this.setState({
			season: data,
		});
	},
	getInitialState: function() {
		return {
			season: window.seasonStore.season,
		};
	},
	componentDidMount: function() {
		this.listenTo(window.seasonStore, this.onStatusChange);
	},
	render: function() {
		if (this.state.season === null) {
			return (<div></div>);
		}
		var rows = [];
		var admin = this.props.admin;
		this.state.season.Weeks.forEach(function(week) {
			rows.push(
					<Panel header={"Week " + week.Number + " (" + week.PlayDate + ") -" +  "Scenario Numbers: [" + week.Scenarios[0] + ", " + week.Scenarios[1] + "]"} key={week.Number}>
						<WeekGroup week={week} admin={admin} key={week.Number}/>
					</Panel>
			);
		});
		return (
			<div className="text-center">
				<Grid>
					<Row>
						<PageHeader>{this.state.season.Name + " (" + this.state.season.Year + ")"}</PageHeader>
					</Row>
					<Row>
						<Accordion>{rows}</Accordion>
					</Row>
				</Grid>
			</div>
		);
	}
});
