/** @jsx React.DOM */

var SeasonData = React.createClass({
	render: function() {
		var admin = window.location.pathname.indexOf("admin") > -1;
		admin_only_pane = [];
		if (admin) {
			admin_only_pane = (
				<TabPane key={3} tab="PlayerEditing">
					<PlayerEditorPanel />
				</TabPane>
			);
		}
		return (
			<TabbedArea defaultActiveKey={1}>
				<TabPane key={1} tab="Season Schedule">
					<SeasonScheduleTable admin={admin} />
				</TabPane>
				<TabPane key={2} tab="Conferences">
					<ConferenceContainer admin={admin} />
				</TabPane>
				{admin_only_pane}
			</TabbedArea>
		);
	},
});

React.renderComponent(<SeasonData />,
					  document.getElementById('seasonSchedule'));
