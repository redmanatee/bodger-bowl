/** @jsx React.DOM */

var PlayerCell = React.createClass({
	render: function() {
		var img = (<div></div>);
		var playerLink = (<div>--</div>);
		if (this.props.player !== null) {
			img = (<img className="faction text-left" src={"/img/" + this.props.player.Faction + ".jpg"} alt={"(" + this.props.player.Faction + ")"} title={this.props.player.Faction}/>)
			var hrefTarget = "";
			if (this.props.admin) {
				hrefTarget = "/admin/players/?player=" + encodeURIComponent(this.props.player.Name) + "&season=" + window.seasonStore.seasonId;
			} else {
				hrefTarget = window.location.pathname;
				if (hrefTarget.indexOf("/", hrefTarget.length - 1) === -1){
					hrefTarget += "/";
				}
				hrefTarget += "players/" + this.props.player.Name;
			}
			playerLink = (<a href={hrefTarget} target="_blank">{this.props.player.Name}</a>);
		}
		return (
			<td>
				{playerLink}
				{img}
			</td>
		);
	}
});

var GameRow = React.createClass({
	handleChange: function(event) {
		$.ajax({url:"/admin/api/weeks/",
			type: 'POST',
			data: {
				SeasonId: decodeURIComponent(window.seasonStore.seasonId),
				Data: event.target.value
			},
			success: function(data) {
				//TODO: this
			}.bind(this),
			error: function(xhr, status, err) {
    			//TODO: this
  			}.bind(this)
		});
	},
	render: function() {
		var winnerRow = (<PlayerCell player={this.props.winner} admin={this.props.admin} />);
		var player1Selected = this.props.winner? this.props.player1.Name === this.props.winner.Name : false;
		var player2Selected = this.props.winner? this.props.player2.Name === this.props.winner.Name : false;
		if (this.props.admin && this.props.admin !== "false") {
			var baseString = this.props.week + ":" + this.props.player1.Name + ":" + this.props.player2.Name + ":";
			var defaultValue = baseString;
			if (player1Selected) {
				defaultValue += this.props.player1.Name;
			} else if (player2Selected) {
				defaultValue += this.props.player2.Name;
			}
			winnerRow = (
				<td>
					<select name="" onChange={this.handleChange} defaultValue={defaultValue}>
						<option value={baseString} selected={!player1Selected && player2Selected}>-</option>
						<option value={baseString + this.props.player1.Name}>{this.props.player1.Name}</option>
						<option value={baseString + this.props.player2.Name}>{this.props.player2.Name}</option>
					</select>
				</td>
			);
		}
		return (
			<tr>
				<PlayerCell player={this.props.player1} admin={this.props.admin} />
				<PlayerCell player={this.props.player2} admin={this.props.admin} />
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
		this.props.week.Games.forEach(function(game) {
			rows.push(
					<GameRow player1={game.Players[0]} 
							   player2={game.Players[1]} 
							   hasWinner={game.Winner !== null}
							   winner={game.Winner}
							   week={number}
							   admin={admin} />
			);
		});
		return (
			<table striped bordered hover>
				<thead>
					<th>Player 1</th>
					<th>Player 2</th>
					<th>Winner</th>
				</thead>
				<tbody>{rows}</tbody>
			</table>
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
			console.log("Adding a week")
			rows.push(
					<Panel header={"Week " + week.Number + "-" +  "Scenario Numbers: (" + week.Scenarios[0] + ", " + week.Scenarios[1] + ")"} key={week.Number}>
						<WeekGroup week={week} admin={admin} key={week.Number}/>
					</Panel>
			);
		});
		return (
			<div className="text-center">
				<div>{this.state.season.Name + " (" + this.state.season.Year + ")"}</div>
				<Accordion>{rows}</Accordion>
			</div>
		);
	}
});
