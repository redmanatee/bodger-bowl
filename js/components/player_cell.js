var React = require('react');
var AppActions = require('../actions.js');

module.exports = React.createClass({
	render: function() {
		var img = (<div></div>);
		var player = (<div>--</div>);
		if (this.props.player !== null) {
			img = (<img className="faction text-left" src={"/img/" + this.props.player.Faction + ".jpg"} alt={"(" + this.props.player.Faction + ")"} title={this.props.player.Faction}/>);
			var name = this.props.player.Name;
			if(this.props.noLink) {
				player = <span>{this.props.player.Name}</span>;
			} else {
				player = <a onClick={function() { AppActions.viewPlayer(name); }}>{this.props.player.Name}</a>;
			}
		}
		return (
			<div>
				{img}
				{player}
			</div>
		);
	}
});
