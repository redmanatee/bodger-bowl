/* @flow */
var Reflux = require('reflux');
var AppActions = require('../actions.js');


module.exports = Reflux.createStore({
	init: function() {
		this.listenTo(AppActions.loadUser, this.loadUser);
		this.listenTo(AppActions.getUser, this.getUser);
		this.listenTo(AppActions.redirectUrl, this.redirectUrl);
	},
	loadUser: function(){
		$.ajax({
			url:"/api/getUser",
			type: 'GET'
		})
		.success(function(data) { this.getUser(JSON.parse(data)); }.bind(this))
		.error(function(xhr, status, err) { console.error(status, err.toString()); }.bind(this));
	},
	getUser: function(user){
		this.user = user;
		this.trigger(this.user);
	},
	redirectUrl: function() {
		if(this.user.Url.indexOf('http') == -1) {
			window.location.href = 'localhost:8080'+this.user.Url;
			return;
		}
		
		window.location.href = this.user.Url;
	}
});
	
		