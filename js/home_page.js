/** @jsx React.DOM */

var HomeScreen = React.createClass({
	render: function() {
		return (
			<ul className="small-block-grid-1 large-block-grid-2">
				<li><SeasonScheduleTable admin="false" /></li>
				<li><ConferenceContainer admin="false" /></li>
			</ul>
		);
	}
});

React.renderComponent(<HomeScreen />,
					  document.getElementById('seasonSchedule'));
