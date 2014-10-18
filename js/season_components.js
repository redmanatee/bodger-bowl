/** @jsx React.DOM */

var PlayerCell = React.createClass({
	render: function() {
		return (<td>{this.props.player}</td>);
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
			rows.push(<tr><GameRow player1={game.PlayerIds[0]} 
							   player2={game.PlayerIds[1]} 
							   hasWinner={game.WinnerId != null}
							   winner={game.WinnerId}
							   admin={admin} /></tr>
			);
		});
		return (
			<table>
				<thead>
					<th>
						<td colspan="3">{this.props.week.Name}</td>
					</th>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
	}
});

var SeasonScheduleTable = React.createClass({
	loadSeasonFromServer: function() {
		$.ajax({url:"/api/seasons/" + this.props.seasonId,
				type: 'GET',
				dataType: 'json',
				success: function(data) {
					this.setState({
						season: data,
					});
				}.bind(this),
				error: function(xhr, status, err) {
        			console.error(this.props.url, status, err.toString());
      			}.bind(this)
		});
	},
	getInitialState: function() {
		return {
			season: null,
		};
	},
	componentDidMount: function() {
	    this.loadSeasonFromServer();
	    //setInterval(this.loadSeasonFromServer, this.props.pollInterval);
  	},
	render: function() {
		if (this.state.season == null) {
			return (<div></div>);
		}
		var rows = [];
		var admin = this.props.admin;
		this.state.season.Weeks.forEach(function(week) {
			rows.push(<WeekGroup week={week} admin={admin}/>)
		});
		return (
			<div>
				<table>
					<thead>
						<th colspan="3">{this.state.season.Name + " (" + this.state.season.Year + ")"}</th>
					</thead>
				</table>
				{rows}
			</div>
		);
	}
});
