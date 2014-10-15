/** @jsx React.DOM */

var SeasonRow = React.createClass({
	render: function() {
		hrefTarget = "/admin/season?name=" + this.props.season.Name + "&year=" + this.props.season.Year;
		return (
			<tr>
				<td><a href={hrefTarget}>{this.props.season.Name}</a></td>
				<td><a href={hrefTarget}>{this.props.season.Year}</a></td>
				<td><a href={hrefTarget}>{this.props.season.Active ? 'True' : 'False'}</a></td>
			</tr>
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
  				data: '{"Name": "' + name + '", "Year": "' + year + '"}',
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
