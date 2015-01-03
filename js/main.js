/* @flow */
var React = require('react');
var $ = require('jquery-browserify');
var Season = require('./components/season.js');
var AdminSeasonTable = require('./components/admin_season_table');
var AppActions = require('./actions.js');

$(function() {
	var schedule = $('#season-schedule')[0];
	if(schedule) {
		var admin = $('#season-schedule').data('admin');
		React.render(<Season admin={admin} />, schedule);
	}

	var seasons = $('#seasons')[0];
	if(seasons) React.render(<AdminSeasonTable pollInterval="1000" />, seasons);

	AppActions.loadSeason();
});
