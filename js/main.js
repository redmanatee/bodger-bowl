/** @jsx React.DOM */

$(function() {
	var schedule = $('#season-schedule')[0];
	if(schedule) React.renderComponent(<Season />, schedule);

	var seasons = $('#seasons')[0];
	if(seasons) React.renderComponent(<AdminSeasonTable pollInterval="1000" />, seasons);
});
