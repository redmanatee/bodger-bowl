/** @jsx React.DOM */

var getSeasonId=function() {
	var path = window.location.pathname.split('/');
	return path[path.length - 1];
}

React.renderComponent(<SeasonScheduleTable pollInterval="1000" admin="true" seasonId={getSeasonId()} />,
					  document.getElementById('seasonSchedule'));
