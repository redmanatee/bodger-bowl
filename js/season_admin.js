/** @jsx React.DOM */

var SeasonAdmin = React.createClass({
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


React.renderComponent(<SeasonAdmin />,
					  document.getElementById('seasonSchedule'));
