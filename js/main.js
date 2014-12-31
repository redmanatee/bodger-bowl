var React = require('react');
var $ = require('jquery-browserify');
var Season = require('./components/season.js');
var AdminSeasonTable = require('./components/admin_season_table');

$(function() {
	var schedule = $('#season-schedule')[0];
	if(schedule) React.renderComponent(<Season />, schedule);

	var seasons = $('#seasons')[0];
	if(seasons) React.renderComponent(<AdminSeasonTable pollInterval="1000" />, seasons);
});
