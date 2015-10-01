/* @flow */
var Reflux = require('reflux');
var AppActions = require('../actions.js');


module.exports = Reflux.createStore({
	init: function() {
		this.listenTo(AppActions.getUserName, this.getUserName);
	},
	getUserName: function(){
		console.log('getting user name');
		$.ajax({
			url:"/api/getUser",
			type: 'GET',
			success: function(data) {
				console.log("got data", data);
				AppActions.viewUserName(data.Email);
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("get user failed ", err);
				console.error(status, err.toString());
			}.bind(this)
		});
	}
});
	
		