/** @jsx React.DOM */

var SeasonData = React.createClass({
	render: function() {
		var admin = window.location.pathname.indexOf("admin") > -1;
		return (
				<div>
					<SeasonScheduleTable admin={admin} />
					<ConferenceContainer admin={admin} />
				</div>
		);
	}
});


React.renderComponent(<SeasonData />,
					  document.getElementById('seasonSchedule'));
