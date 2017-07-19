'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.taggableReducer = taggableReducer;

var _actions = require('./actions');

var initialState = function initialState() {
	return {
		autoCompleteItems: [],
		options: [],
		tags: [],
		value: [],
		loading: false,
		error: null,
		currentTag: null
	};
};

function taggableReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	var newState = _extends({}, state);

	switch (action.type) {
		case _actions.CREATE_SEARCH_BAR:
			newState[action.key] = initialState();
			newState[action.key].tags = action.content.tags;
			return newState;
		case _actions.GET_OPTIONS:
			newState[action.key].loading = true;
			newState[action.key].error = null;
			return newState;
		case _actions.GET_OPTIONS_FAILURE:
			newState[action.key].loading = false;
			newState[action.key].error = action.content;
			return newState;
		case _actions.GET_OPTIONS_SUCCESS:
			newState[action.key].loading = false;
			newState[action.key].options = action.content;
			return newState;
		case _actions.VALUE_CHANGE:
			newState[action.key].value = action.content;
			newState[action.key].loading = false;
			return newState;
		case _actions.TAG_SELECTED:
			newState[action.key].currentTag = action.content;
			newState[action.key].loading = false;
			return newState;
		default:
			return state;
	}
}