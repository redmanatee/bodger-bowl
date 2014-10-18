/** @jsx React.DOM */

var SeasonAdmin = React.createClass({
	render: function() {
		return (
			<div><SeasonScheduleTable admin="true" /><ConferenceContainer admin="true" /></div>
		);
	}
});

React.renderComponent(<SeasonAdmin />,
					  document.getElementById('seasonSchedule'));
