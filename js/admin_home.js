/** @jsx React.DOM */

var SeasonRow = React.createClass({
	render: function() {
		hrefTarget = "/admin/season?name=" + this.props.season.name + "&year=" + this.props.season.year;
		return (
			<tr>
				<td><a href={hrefTarget}>{this.props.season.name}</a></td>
				<td><a href={hrefTarget}>{this.props.season.year}</a></td>
				<td><a href={hrefTarget}>{this.props.season.active ? 'True' : 'False'}</a></td>
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
		this.refs.addSeasonName.getDOMNode().value = "";
		this.refs.addSeasonYear.getDOMNode().value = "";
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
  		$.ajax({url:"/admin/api/seasons/",
  				type: 'POST',
  				dataType: 'json',
  				data: '{"name": "' + name + '", "year": "' + year + '"}',
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

React.renderComponent(<SeasonTable pollInterval="1000" />, document.getElementById('seasons'));
