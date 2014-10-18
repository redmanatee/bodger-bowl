/** @jsx React.DOM */

var HomeScreen = React.createClass({
	render: function() {
		return (
			<div><SeasonScheduleTable admin="false" /><ConferenceContainer admin="false" /></div>
		);
	}
});

React.renderComponent(<HomeScreen />,
					  document.getElementById('seasonSchedule'));
