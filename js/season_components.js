/** @jsx React.DOM */

var PlayerCell = React.createClass({
	render: function() {
		var img = (<div></div>);
		var playerLink = (<div>--</div>);
		if (this.props.player !== null) {
			img = (<img className="faction text-left" src={"/img/" + this.props.player.Faction + ".jpg"} alt={"(" + this.props.player.Faction + ")"} title={this.props.player.Faction}/>)
			var hrefTarget = window.location.pathname;
			if (hrefTarget.indexOf("/", hrefTarget.length - 1) === -1){
				hrefTarget += "/";
			}
			hrefTarget += "players/" + this.props.player.Name;
			playerLink = (<a href={hrefTarget} target="_blank">{this.props.player? this.props.player.Name : "--"}</a>);
		}
		return (
			<li>
				{playerLink}
				{img}
			</li>
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
			dataType: 'json',
			success: function(data) {
				this.loadSeason(data);
			}.bind(this),
			error: function(xhr, status, err) {
    			console.error(this.props.url, status, err.toString());
  			}.bind(this)
		});

	},
	render: function() {
		var winnerRow = (<PlayerCell player={this.props.winner} admin={this.props.admin} />);
		var player1Selected = this.props.winner? this.props.player1.Name === this.props.winner.Name : false;
		var player2Selected = this.props.winner? this.props.player2.Name === this.props.winner.Name : false;
		if (this.props.admin && this.props.admin !== "false") {
			var baseString = this.props.week + ":" + this.props.player1.Name + ":" + this.props.player2.Name + ":";
			winnerRow = (
				<li>
					<select name="" onChange={this.handleChange}>
						<option value={baseString} selected={!player1Selected && player2Selected}>-</option>
						<option value={baseString + this.props.player1.Name} selected={player1Selected}>{this.props.player1.Name}</option>
						<option value={baseString + this.props.player2.Name} selected={player2Selected}>{this.props.player2.Name}</option>
					</select>
				</li>
			);
		}
		return (
			<ul className="small-block-grid-3">
				<PlayerCell player={this.props.player1} admin={this.props.admin} />
				<PlayerCell player={this.props.player2} admin={this.props.admin} />
				{winnerRow}
			</ul>
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
				<ul className="small-block-grid-1">
					<li>{"Week " + number}</li>
					<li>{"Scenario Numbers: (" + this.props.week.Scenarios[0] + ", " + this.props.week.Scenarios[1] + ")"}</li>
					<ul className="small-block-grid-3">
						<li>Player 1</li>
						<li>Player 2</li>
						<li>Winner</li>
					</ul>
					{rows}
				</ul>
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
			rows.push(<WeekGroup week={week} admin={admin} key={week.Number}/>)
		});
		return (
			<div className="text-center">
				<ul className="small-block-grid-1">
					<li>{this.state.season.Name + " (" + this.state.season.Year + ")"}</li>
				</ul>
				{rows}
			</div>
		);
	}
});
