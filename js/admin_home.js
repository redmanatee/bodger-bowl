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
	render: function() {
		var rows = []
		this.state.seasons.forEach(function(season) {
			rows.push(<SeasonRow season={season} />);
		});
		return (
			<table>
				<thead>
					<th>Name</th>
					<th>Year</th>
					<th>Active</th>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
	}
});

React.renderComponent(<SeasonTable pollInterval="1000" />, document.getElementById('seasons'));
