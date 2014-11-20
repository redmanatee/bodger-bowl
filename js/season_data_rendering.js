/** @jsx React.DOM */

var SeasonData = React.createClass({
	render: function() {
		var admin = window.location.pathname.indexOf("admin") > -1;
		return (
			<TabbedArea justified defaultActiveKey={1}>
				<TabPane key={1} tab="Season Schedule">
					<SeasonScheduleTable admin={admin} />
				</TabPane>
				<TabPane key={2} tab="Conferences">
					<ConferenceContainer admin={admin} />
				</TabPane>
				<TabPane key={3} tab="Player Data">
					<PlayerEditorPanel  admin={admin}  />
				</TabPane>
			</TabbedArea>
		);
	},
});

React.renderComponent(<SeasonData />,
					  document.getElementById('seasonSchedule'));
