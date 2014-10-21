/** @jsx React.DOM */

var SeasonData = React.createClass({
	render: function() {
		var admin = window.location.pathname.indexOf("admin") > -1;
		return (
			<div>
				<div className="row">
					<div className="small-grid-12 columns">
						<SeasonScheduleTable admin={admin} />
					</div>
				</div>
				<ConferenceContainer admin={admin} />
			</div>
		);
	}
});


React.renderComponent(<SeasonData />,
					  document.getElementById('seasonSchedule'));
