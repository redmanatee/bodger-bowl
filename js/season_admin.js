/** @jsx React.DOM */

var TopTabPanel = React.createClass({
	render: function() {
		return (	
				<ul class="tabs" data-tab="" role="tablist">
					<li class="tab-title active" role="presentational" ><a href="#panel1" role="tab" tabindex="0" aria-selected="true" controls="panel1">Tab 1</a></li>
		 			<li class="tab-title" role="presentational" ><a href="#panel2" role="tab" tabindex="0"aria-selected="false" controls="panel2">Tab 2</a></li>
				</ul>
)
	}
})

var SeasonAdmin = React.createClass({
	render: function() {
		var admin = window.location.pathname.indexOf("admin") > -1;
		return (
				<div className="tabs-content">
	  				<div className="content active" id="panel1">
						<SeasonScheduleTable admin={admin} />
					</div>
					<div className="content" id="panel2">
						<ConferenceContainer admin={admin} />
					</div>
				</div>
		);
	}
});


React.renderComponent(<SeasonAdmin />,
					  document.getElementById('seasonSchedule'));
