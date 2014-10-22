/** @jsx React.DOM */

var PlayerInfoCell = React.createClass({
	render: function() {
		return (
			<ul className="small-block-grid-1">
				<li>{this.props.player.Name}</li>
				<li>{this.props.player.Faction}<img className="faction text-left" src={"/img/" + this.props.player.Faction + ".jpg"} alt={this.props.player.Faction} /></li>
			</ul>
		);
	}
});

var InjuriesInfo = React.createClass({
	render: function() {
		var rows = [];
		if (this.props.player.Injuries === null || this.props.player.Injuries.length === 0) {
			rows.push(<li className="font-weight-bold">--None--</li>);
		} else {
			this.props.player.Injuries.forEach(function(injury) {
				rows.push(
					<li>{injury}</li>
				);
			});
		}
		return (
			<ul className="small-block-grid-1">
				<li>Injuries</li>
				{rows}
			</ul>
		);
	}
});

var ActiveBondsInfo = React.createClass({
	render: function() {
		var rows = [];
		if (this.props.player.Bonds.ActiveBonds === null || this.props.player.Bonds.ActiveBonds.length === 0) {
			rows.push(<li>--None--</li>);
		} else {
			rows.push(
				<ul className="small-block-grid-4">
					<li>Warcaster</li>
					<li>Warjack</li>
					<li>Bond #</li>
					<li>Bond Name</li>
				</ul>
			);
			this.props.player.Bonds.ActiveBonds.forEach(function(bond) {
				rows.push(
					<ul className="small-block-grid-4">
						<li>{bond.Warcaster}</li>
						<li>{bond.Warjack}</li>
						<li>{bond.BondNumber}</li>
						<li>{bond.BondName}</li>
					</ul>
				);
			});
		}
		return (
			<ul className="small-block-grid-1">
				<li>Bonds</li>
				{rows}
			</ul>
		);
	}
});

var PotentialBondsInfo = React.createClass({
	render: function() {
		var rows = [];
		if (this.props.player.Bonds.PotentialBonds === null || this.props.player.Bonds.PotentialBonds.length === 0) {
			rows.push(<li>--None--</li>);
		} else {
			rows.push(
				<ul className="small-block-grid-3">
					<li>Warcaster</li>
					<li>Warjack</li>
					<li>Bonus</li>
				</ul>
			);
			this.props.player.Bonds.PotentialBonds.forEach(function(bond) {
				rows.push(
					<ul className="small-block-grid-3">
						<li>{bond.Warcaster}</li>
						<li>{bond.Warjack}</li>
						<li>{bond.Bonus}</li>
					</ul>
				);
			});
		}
		return (
			<ul className="small-block-grid-1">
				<li>Bonds</li>
				{rows}
			</ul>
		);
	}
});

var PlayerPanel = React.createClass({
	loadPlayerFromServer: function() {
		var path = window.location.pathname.split('/');
		console.log(path);
		var seasonId = decodeURIComponent(path[path.length-3]);
		var playerId = decodeURIComponent(path[path.length-1]);
		console.log(seasonId);
		console.log(playerId);
		$.ajax({url:"/api/players/",
				type: 'POST',
				dataType: 'json',
				data: {SeasonId:seasonId, PlayerId:playerId},
				success: function(data) {
					this.setState({player: data});
				}.bind(this),
				error: function(xhr, status, err) {
        			console.error(this.props.url, status, err.toString());
      			}.bind(this)
		});
	},
	getInitialState: function() {
		return {player:null}
	},
	componentDidMount: function() {
	    this.loadPlayerFromServer();
  	},
	render: function() {
		if (this.state.player === null) {
			return (<div></div>);
		}
		return (
			<div className="row">
				<div className="small-12"><PlayerInfoCell player={this.state.player} /></div>
				<div className="small-12"><InjuriesInfo player={this.state.player} /></div>
				<div className="small-12"><ActiveBondsInfo player={this.state.player} /></div>
				<div className="small-12"><PotentialBondsInfo player={this.state.player} /></div>
			</div>
		);
	}
});

