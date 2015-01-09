/* @flow */
var React = require('react');
var Bracket = require('./bracket.js');
var PlayerCell = require('./player_cell.js');

module.exports = React.createClass({
	propTypes: {
		season: React.PropTypes.object.isRequired
	},
	cellRenderer: function(roundNumber: number, gameNumber: number, playerNumber: number) {
		var week = this.props.season.Weeks[7 + roundNumber];
		var game = week && week.Games[gameNumber - 1];
		var player = game && game.Players[playerNumber - 1];
		var result = player && <PlayerCell player={player}/>;
		return player && game.Winner && game.Winner.Name == player.Name ? <strong>{result}</strong> : result;
	},
	render: function(): ?ReactElement {
		return (
			<Bracket rounds={4} cellRenderer={this.cellRenderer} />
		);
	}
});
