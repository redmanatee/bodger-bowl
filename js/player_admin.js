/** @jsx React.DOM */

var PlayerInfoAdminPanel = React.createClass({
	render: function() {
		return (
			<div>
				<div>{this.props.player.Name}</div>
				<div>{this.props.player.Faction}<img className="faction" src={"/img/" + this.props.player.Faction + ".jpg"} alt={this.props.player.Faction}/></div>
			</div>
		);
	}
});

var InjuriesAdminPanel = React.createClass({
	injuryValue: "",
	handleChange: function(event) {
		this.injuryValue = event.target.value;
	},
	updateData: function(event) {
		console.log("button pushed");
		$.ajax({url:"/admin/api/players/injuries/",
			type: 'POST',
			data: {
				SeasonId: this.props.season,
				Player: this.props.player.Name,
				Injuries: this.injuryValue,
			},
			success: function(data) {
				alert("Injury update was successful!");
			}.bind(this),
			error: function(xhr, status, err) {
				alert("Injury update failed!");
  			}.bind(this)
		});

	},
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
			<div>
				<ul>
					<li>Injuries</li>
					<ul>{rows}</ul>
				</ul>
				<div>Update Injuries: <input type="text" onChange={this.handleChange} /><input type="button" onClick={this.updateData} value="Update" /></div>
			</div>	
		);
	}
});

var ActiveBondsAdminPanel = React.createClass({
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

var PotentialBondsAdminPanel = React.createClass({
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

var PlayerAdminPanel = React.createClass({
	getSearchParameters: function() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? this.transformToAssocArray(prmstr) : {};
	},
	transformToAssocArray: function(prmstr ) {
	    var params = {};
	    var prmarr = prmstr.split("&");
	    for ( var i = 0; i < prmarr.length; i++) {
	        var tmparr = prmarr[i].split("=");
	        params[tmparr[0]] = tmparr[1];
	    }
	    return params;
	},
	loadPlayerFromServer: function() {
		var winParams = this.getSearchParameters();
		$.ajax({url:"/api/players/",
			type: 'POST',
			dataType: 'json',
			data: {
				SeasonId:decodeURIComponent(winParams['season']), 
				PlayerId:decodeURIComponent(winParams['player'])
			},
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
		var winParams = this.getSearchParameters();
		var season = decodeURIComponent(winParams['season']);
		return (
			<div className="row">
				<div className="small-12"><PlayerInfoAdminPanel player={this.state.player} season={season} /></div>
				<div className="small-12"><InjuriesAdminPanel player={this.state.player} season={season} /></div>
				<div className="small-12"><ActiveBondsAdminPanel player={this.state.player} season={season} /></div>
				<div className="small-12"><PotentialBondsAdminPanel player={this.state.player} season={season} /></div>
			</div>
		);
	}
});


React.renderComponent(<PlayerAdminPanel />,
					  document.getElementById('player'));
