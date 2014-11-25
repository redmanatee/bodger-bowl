/** @jsx React.DOM */

var SeasonData = React.createClass({
	mixins: [Reflux.listenTo(window.viewPlayerStore, "showPlayerData")],
	getInitialState: function() {
		return {activeKey: 1};
	},
	handleSelect: function(selectKey) {
		this.setState({activeKey: selectKey});
	},
	showPlayerData: function() {
		this.setState({activeKey: 3});
	},
	render: function() {
		var admin = window.location.pathname.indexOf("admin") > -1;
		return (
			<TabbedArea className="main-nav" activeKey={this.state.activeKey} justified onSelect={this.handleSelect}>
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
