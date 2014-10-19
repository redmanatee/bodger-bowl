/** @jsx React.DOM */

var SeasonAdmin = React.createClass({
	render: function() {
		return (
			<ul className="small-block-grid-1 large-block-grid-2">
				<li><SeasonScheduleTable admin="true" /></li>
				<li><ConferenceContainer admin="true" /></li>
			</ul>
		);
	}
});

React.renderComponent(<SeasonAdmin />,
					  document.getElementById('seasonSchedule'));
