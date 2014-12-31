/** @jsx React.DOM */

var SeasonData = React.createClass({
	mixins: [Reflux.listenTo(window.viewStore, "view")],
	getInitialState: function() {
		return {activeKey: 1};
	},
	view: function(state) {
		this.setState({activeKey: state.mainTab});
	},
	render: function() {
		var admin = $('#season-schedule').data('admin');
		return (
			<TabbedArea className="main-nav" activeKey={this.state.activeKey} justified onSelect={window.appActions.viewMainTab}>
				<TabPane key={1} tab="Season Schedule">
					<SeasonScheduleTable admin={admin} />
				</TabPane>
				<TabPane key={2} tab="Conferences">
					<ConferenceContainer admin={admin} />
				</TabPane>
				<TabPane key={3} tab="Players">
					<PlayerContainer  admin={admin}  />
				</TabPane>
			</TabbedArea>
		);
	},
});


$(function() {
	var schedule = $('#season-schedule')[0];
	if(schedule) React.renderComponent(<SeasonData />, schedule);
});
