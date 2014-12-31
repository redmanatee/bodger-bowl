/** @jsx React.DOM */

var React = require('react');

var AdminSeasonRow = React.createClass({
	render: function() {
		hrefTarget = "/admin/seasons/" + encodeURIComponent(this.props.season.Name + ";" + this.props.season.Year);
		return (
			<tr>
				<td><a href={hrefTarget}>{this.props.season.Name}</a></td>
				<td><a href={hrefTarget}>{this.props.season.Year}</a></td>
				<td><a href={hrefTarget}>{this.props.season.Active ? 'True' : 'False'}</a></td>
			</tr>
		);
	}
});

module.exports = React.createClass({
	loadSeasonsFromServer: function() {
		$.ajax({url:"/api/seasons/",
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
	},
	render: function() {
		var rows = [];
		this.state.seasons.forEach(function(season) {
			rows.push(<AdminSeasonRow season={season} />);
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
