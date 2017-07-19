'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createSearchBar = createSearchBar;
exports.handleValueChange = handleValueChange;
exports.handleInputChange = handleInputChange;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var CREATE_SEARCH_BAR = 'taggableSearch/CREATE_SEARCH_BAR';
exports.CREATE_SEARCH_BAR = CREATE_SEARCH_BAR;
var VALUE_CHANGE = 'taggableSearch/VALUE_CHANGE';
exports.VALUE_CHANGE = VALUE_CHANGE;
var GET_OPTIONS = 'taggableSearch/GET_OPTIONS';
exports.GET_OPTIONS = GET_OPTIONS;
var GET_OPTIONS_SUCCESS = 'taggableSearch/GET_OPTIONS_SUCCESS';
exports.GET_OPTIONS_SUCCESS = GET_OPTIONS_SUCCESS;
var GET_OPTIONS_FAILURE = 'taggableSearch/GET_OPTIONS_FAILURE';
exports.GET_OPTIONS_FAILURE = GET_OPTIONS_FAILURE;
var TAG_SELECTED = 'taggableSearch/TAG_SELECTED';

exports.TAG_SELECTED = TAG_SELECTED;
var buildQueryParams = function buildQueryParams() {
	var values = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	var hiddenFilters = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	var params = {};
	values.forEach(function (tag) {
		params[tag.tagKey] = tag.option.value;
	});
	return _extends({}, hiddenFilters, params);
};

var fetchResource = function fetchResource(uri) {
	var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	return new Promise(function (resolve, reject) {
		_superagent2['default'].get(uri).set(headers).end(function (err) {
			var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			var body = _ref.body;
			return err ? reject(body || err) : resolve(body);
		});
	});
};

var getDebouncedOptions = _lodash2['default'].debounce(function (dispatch, state, input, searchKey, resolve) {
	var sortByTerm = function sortByTerm(data, term) {
		/*
   * Sorts two option objects by how close the search string is to the beginning of the option's name
   * e.g. term: piz and options: [apizzetto, berpizzo, pizza, pizzeria] should resolve to
   *      [pizza, pizzeria, apizzetto, berpizzo]
   */
		term = term.toLowerCase();
		return data.sort(function (a, b) {
			return a.label.toLowerCase().indexOf(term) < b.label.toLowerCase().indexOf(term) ? -1 : 1;
		});
	};

	if (state.currentTag && state.currentTag.optionResourceUri) {
		dispatch({
			type: GET_OPTIONS,
			key: searchKey
		});
		var uri = state.currentTag.optionResourceUri + '?' + state.currentTag.optionResourceFilterKey + '=' + input;
		fetchResource(uri, state.currentTag.optionResourceUriHeaders).then(function (resp) {
			resp = sortByTerm(state.currentTag.optionCreationFactory(resp), input);
			resolve();
			dispatch({
				type: GET_OPTIONS_SUCCESS,
				content: resp,
				key: searchKey
			});
		});
	} else if (state.currentTag) {
		var options = _lodash2['default'].filter(state.currentTag.options, function (option) {
			return option.label.toLowerCase().includes(input.toLowerCase());
		});
		var result = sortByTerm(options, input);
		dispatch({
			type: GET_OPTIONS_SUCCESS,
			content: result,
			key: searchKey
		});
		resolve();
	}
}, 500, { leading: false, trailing: true });

var getUnusedTags = function getUnusedTags(state) {
	return _lodash2['default'].filter(state.tags, function (tag) {
		return _lodash2['default'].map(state.value, 'tagKey').indexOf(tag.tagKey) === -1;
	});
};

function createSearchBar(searchKey, searchFn) {
	var tags = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	var hiddenFilters = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	return function (dispatch, getState) {
		var state = getState();

		if (!state.taggableSearch[searchKey]) {
			dispatch({
				type: CREATE_SEARCH_BAR,
				key: searchKey,
				content: { searchKey: searchKey, tags: tags }
			});
		}

		if (searchFn) {
			var searchParams = state.taggableSearch[searchKey] ? state.searchBar[searchKey].value.slice() : [];
			var queryParams = buildQueryParams(searchParams, hiddenFilters);
			searchFn(queryParams);
		}
	};
}

function handleValueChange(searchKey, searchFn) {
	var values = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	var hiddenFilters = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	return function (dispatch, getState) {
		var state = getState().taggableSearch[searchKey];
		var oldValues = state.value;

		var removed = _lodash2['default'].difference(oldValues, values);
		var added = _lodash2['default'].difference(values, oldValues);

		if (removed.length >= 1) {
			// If a tag was removed from the search, set the select options to the tags
			// If the tag had a selected option, also remove it from the tag
			removed = removed[0];
			if (removed.option) {
				removed.option = null;
			}

			dispatch({
				type: TAG_SELECTED,
				key: searchKey,
				content: null
			});
			dispatch({
				type: GET_OPTIONS_SUCCESS,
				key: searchKey,
				content: getUnusedTags(state)
			});
			dispatch({
				type: VALUE_CHANGE,
				key: searchKey,
				content: values
			});
			searchFn(buildQueryParams(values, hiddenFilters));
		} else if (added.length >= 1) {
			added = added[0];

			// If the added object is a tag, get its options and add it to the values.
			// Else if the input is a search term, create a search tag for the input and remove it from the values array.
			// Else, add the option to its tag and remove it from the values array
			if (added.tagKey) {
				var defaultStyle = {
					backgroundColor: 'transparent',
					borderColor: 'transparent',
					color: 'black'
				};
				added.style = defaultStyle;
				dispatch({
					type: TAG_SELECTED,
					key: searchKey,
					content: added
				});
				dispatch({
					type: VALUE_CHANGE,
					key: searchKey,
					content: values
				});
				if (added.optionResourceUri) {
					dispatch({
						type: GET_OPTIONS,
						key: searchKey
					});
					fetchResource(added.optionResourceUri, added.optionResourceUriHeaders).then(function (result) {
						dispatch({
							type: GET_OPTIONS_SUCCESS,
							content: added.optionCreationFactory(result),
							key: searchKey
						});
					})['catch'](function (err) {
						dispatch({
							type: GET_OPTIONS_FAILURE,
							content: err,
							key: searchKey
						});
					});
				} else {
					dispatch({
						type: GET_OPTIONS_SUCCESS,
						content: added.options,
						key: searchKey
					});
				}
			} else if (state.currentTag === null) {
				var searchObject = {
					tagKey: 'search',
					tagLabel: 'Search',
					option: added
				};
				values = _lodash2['default'].reject(values, { value: added.value, label: added.label });
				values = _lodash2['default'].concat(values, searchObject);
				dispatch({
					type: VALUE_CHANGE,
					key: searchKey,
					content: values
				});
				var queryParams = buildQueryParams(values, hiddenFilters);
				searchFn(queryParams);
			} else {
				values = _lodash2['default'].reject(values, { label: added.label, value: added.value });
				var tags = getUnusedTags(state);
				dispatch({
					type: GET_OPTIONS_SUCCESS,
					key: searchKey,
					content: tags
				});
				var currentTag = state.currentTag;
				currentTag.option = added;
				currentTag.style = _extends({}, currentTag.tagStyle || {});
				dispatch({
					type: VALUE_CHANGE,
					key: searchKey,
					content: values
				});
				dispatch({
					type: TAG_SELECTED,
					key: searchKey,
					content: null
				});
				var queryParams = buildQueryParams(values, hiddenFilters);
				searchFn(queryParams);
			}
		}
	};
}

function handleInputChange(searchKey, input, resolve) {
	return function (dispatch, getState) {
		var state = getState().taggableSearch[searchKey];

		// If there aren't any currently selected tags, filter the options based on the tags.
		// Else, fetch the options using [input] as a search param
		if (state.currentTag === null) {
			var options = _lodash2['default'].filter(state.tags, function (tag) {
				if (!input && !Object.keys(state.value).includes(tag.tagKey)) return tag;
				return tag.tagLabel.toUpperCase().includes(input.toUpperCase()) && !Object.keys(state.value).includes(tag.tagKey);
			});
			dispatch({
				type: GET_OPTIONS_SUCCESS,
				content: options,
				key: searchKey
			});
			resolve();
		} else {
			getDebouncedOptions(dispatch, state, input, searchKey, resolve);
		}
	};
}