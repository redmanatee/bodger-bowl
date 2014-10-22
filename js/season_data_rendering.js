/** @jsx React.DOM */

var BootstrapTabbedArea = ReactBootstrap.TabbedArea;
var BootstrapTabPane = ReactBootstrap.TabPane;

var SeasonData = React.createClass({
	render: function() {
		var admin = window.location.pathname.indexOf("admin") > -1;
		return (
			
			<BootstrapTabbedArea defaultActiveKey={1}>
				<BootstrapTabPane key={1} tab="Season Schedule"><SeasonScheduleTable admin={admin} /></BootstrapTabPane>
				<BootstrapTabPane key={2} tab="Conferences"><ConferenceContainer admin={admin} /></BootstrapTabPane>
			</BootstrapTabbedArea>
		);
	},

});

React.renderComponent(<SeasonData />,
					  document.getElementById('seasonSchedule'));
