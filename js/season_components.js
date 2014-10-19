/** @jsx React.DOM */

var PlayerCell = React.createClass({
	render: function() {
		return (<li className={this.props.player? this.props.player.Faction : ""}>{this.props.player? this.props.player.Name : ""}</li>);
	}
});

var GameRow = React.createClass({
	render: function() {
		return (
			<ul className="small-block-grid-3">
				<PlayerCell player={this.props.player1} admin={this.props.admin} />
				<PlayerCell player={this.props.player2} admin={this.props.admin} />
				<PlayerCell player={this.props.winner} admin={this.props.admin} />
			</ul>
		);
	}
});

var WeekGroup = React.createClass({
	render: function() {
		var rows = [];
		var admin = this.props.admin;
		this.props.week.Games.forEach(function(game) {
			rows.push(<GameRow player1={game.Players[0]} 
							   player2={game.Players[1]} 
							   hasWinner={game.Winner != null}
							   winner={game.Winner}
							   admin={admin} />
			);
		});
		return (
			<div>
				<ul className="small-block-grid-1">
					<li>{"Week " + this.props.week.Number}</li>
				</ul>
				{rows}
			</div>
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
			<div className="centered">
				<ul className="small-block-grid-1">
					<li>{this.state.season.Name + " (" + this.state.season.Year + ")"}</li>
				</ul>
				{rows}
			</div>
		);
	}
});
