/** @jsx React.DOM */

var SeasonData = React.createClass({
	render: function() {
		var admin = window.location.pathname.indexOf("admin") > -1;
		return (
				<div className="row">
					<div className="small-grid-12 columns">
						<SeasonScheduleTable admin={admin} />
					</div>
					<div className="small-grid-12 columns">
						<ConferenceContainer admin={admin} />
					</div>
				</div>
		);
	}
});


React.renderComponent(<SeasonData />,
					  document.getElementById('seasonSchedule'));
