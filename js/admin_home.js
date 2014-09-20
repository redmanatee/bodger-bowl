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
	render: function() {
		var rows = []
		this.props.seasons.forEach(function(season) {
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

var SEASONS = [
	{name: 'I', year: '2012', active: Boolean('false')},
	{name: 'II', year: '2012', active: false},
	{name: 'III', year: '2013', active: false},
	{name: 'IV', year: '2014', active: true}
];

React.renderComponent(<SeasonTable seasons={SEASONS} />, document.getElementById('seasons'));
