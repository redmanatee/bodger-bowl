/** @jsx React.DOM */

var PlayerCell = React.createClass({
	render: function() {
		return (<td class={this.props.player? this.props.player.Faction : ""}>{this.props.player? this.props.player.Name : ""}</td>);
	}
});

var GameRow = React.createClass({
	render: function() {
		return (
			<tr>
				<td><PlayerCell player={this.props.player1} admin={this.props.admin} /></td>
				<td><PlayerCell player={this.props.player2} admin={this.props.admin} /></td>
				<td><PlayerCell player={this.props.winner} admin={this.props.admin} /></td>
			</tr>
		);
	}
});

var WeekGroup = React.createClass({
	render: function() {
		var rows = [];
		var admin = this.props.admin;
		this.props.week.Games.forEach(function(game) {
			rows.push(<tr><GameRow player1={game.Players[0]} 
							   player2={game.Players[1]} 
							   hasWinner={game.Winner != null}
							   winner={game.Winner}
							   admin={admin} /></tr>
			);
		});
		return (
			<table>
				<thead>
					<th>
						<th colSpan="3">{"Week " + this.props.week.Number}</th>
					</th>
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
			rows.push(<WeekGroup week={week} admin={admin} key={week.Number}/>)
		});
		return (
			<div>
				<table>
					<thead>
						<th colSpan="3">{this.state.season.Name + " (" + this.state.season.Year + ")"}</th>
					</thead>
				</table>
				{rows}
			</div>
		);
	}
});
