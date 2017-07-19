var React = require('react');
var ReactDOM = require('react-dom');
var ReactTaggableSearch = require('react-taggable-search');

var App = React.createClass({
	render () {
		return (
			<div>
				<ReactTaggableSearch />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
