/* @flow */
var React = require('react');

module.exports = React.createClass({
	propTypes: {
		rounds: React.PropTypes.number.isRequired,
		cellRenderer: React.PropTypes.func.isRequired
	},
	render: function(): ?ReactElement {
		var contents = [];
		for (var round = 1; round <= this.props.rounds; round++) {
			var roundPlayerCount = Math.pow(2, this.props.rounds - round + 1);
			var roundContents = [];
			for (var game = 1; game <= roundPlayerCount / 2; game++) {
				roundContents.push(<li className="game game-top">{this.props.cellRenderer(round, game, 1)}</li>);
				roundContents.push(<li className="game game-spacer">&nbsp;</li>);
				roundContents.push(<li className="game game-bottom">{this.props.cellRenderer(round, game, 2)}</li>);
				roundContents.push(<li className="spacer">&nbsp;</li>);
			}
			contents.push(
				<ul className="round" key={round}>
					<li className="spacer">&nbsp;</li>
					{roundContents}
				</ul>
			);
		}
		return (
			<div className="bracket">
				{contents}
			</div>
		);
	}
});
