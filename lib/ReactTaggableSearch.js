'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactRedux = require('react-redux');

var _actions = require('./actions');

var _taggableSearchPresentationalComponent = require('./taggableSearchPresentationalComponent');

var _taggableSearchPresentationalComponent2 = _interopRequireDefault(_taggableSearchPresentationalComponent);

var mapStateToProps = function mapStateToProps(state, ownProps) {
	var searchKey = ownProps.searchKey;

	return {
		store: state.taggableSearch,
		searchKey: searchKey
	};
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	var searchKey = ownProps.searchKey;
	var searchFn = ownProps.searchFn;
	var tags = ownProps.tags;
	var hiddenFilters = ownProps.hiddenFilters;

	return {
		onMount: function onMount() {
			dispatch((0, _actions.createSearchBar)(searchKey, searchFn, tags, hiddenFilters));
		},
		onValueChange: function onValueChange(values) {
			dispatch((0, _actions.handleValueChange)(searchKey, searchFn, values, hiddenFilters));
		},
		onInputChange: function onInputChange(input) {
			var promise = new Promise(function (resolve, reject) {
				dispatch((0, _actions.handleInputChange)(searchKey, input, resolve, reject));
			});
			return promise;
		}
	};
};

var ReactTaggableSearch = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_taggableSearchPresentationalComponent2['default']);

exports['default'] = ReactTaggableSearch;

var _reducer = require('./reducer');

Object.defineProperty(exports, 'taggableReducer', {
	enumerable: true,
	get: function get() {
		return _reducer.taggableReducer;
	}
});