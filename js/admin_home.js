/** @jsx React.DOM */

var SeasonRow = React.createClass({
	render: function() {
		return (
			<tr>
				<td>{this.props.season.name}</td>
				<td>{this.props.season.year}</td>
				<td>{this.props.season.active ? 'True' : 'False'}</td>
			</tr>
		);
	}
});

var SeasonEntryBar = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var seasonName = this.refs.addSeasonName.getDOMNode().value;
		var seasonYear = this.refs.addSeasonYear.getDOMNode().value;
		this.props.onAddSeason(seasonName, seasonYear);
		return false;
	},
	render: function() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Name" ref="addSeasonName" />
				<input type="text" placeholder="Year" ref="addSeasonYear" />
				<input type="submit" value="Add" />
			</form>
		);
	}
});

var SeasonTable = React.createClass({
	loadSeasonsFromServer: function() {
		$.ajax({url:"/admin/api/seasons/",
				type: 'GET',
				dataType: 'json',
				success: function(data) {
					this.setState({seasons: data});
				}.bind(this),
				error: function(xhr, status, err) {
        			console.error(this.props.url, status, err.toString());
      			}.bind(this)
		});
	},
	getInitialState: function() {
		return {seasons:[]};
	},
	componentDidMount: function() {
	    this.loadSeasonsFromServer();
	    setInterval(this.loadSeasonsFromServer, this.props.pollInterval);
  	},
  	addSeason: function(name, year) {
  		alert("Called function with " + name + " and " + year);
  		$.ajax({url:"/admin/api/seasons/",
  				type: 'POST',
  				dataType: 'json',
  				data: {name: name, year: year},
  				success: function(data) {
  					this.loadSeasonsFromServer();
  				}.bind(this),
  				error: function(xhr, status, err) {
        			console.error(this.props.url, status, err.toString());
      			}.bind(this)
  		});
  	},
	render: function() {
		var rows = []
		this.state.seasons.forEach(function(season) {
			rows.push(<SeasonRow season={season} />);
		});
		return (
			<div>
			<SeasonEntryBar onAddSeason={this.addSeason} />
				<table>
					<thead>
						<th>Name</th>
						<th>Year</th>
						<th>Active</th>
					</thead>
					<tbody>{rows}</tbody>
				</table>
			</div>
		);
	}
});

React.renderComponent(<SeasonTable pollInterval="60000" />, document.getElementById('seasons'));
