import {
	CREATE_SEARCH_BAR,
	VALUE_CHANGE,
	GET_OPTIONS,
	GET_OPTIONS_SUCCESS,
	GET_OPTIONS_FAILURE,
	TAG_SELECTED
} from './actions';

const initialState = () => {
	return {
		autoCompleteItems: [],
		options: [],
		tags: [],
		value: [],
		loading: false,
		error: null,
		currentTag: null
	}
};

export function taggableReducer(state = {}, action = {}) {
	const newState = {...state};
	
	switch (action.type) {
		case CREATE_SEARCH_BAR:
			newState[action.key] = initialState();
			newState[action.key].tags = action.content.tags;
			return newState;
		case GET_OPTIONS:
			newState[action.key].loading = true;
			newState[action.key].error = null;
			return newState;
		case GET_OPTIONS_FAILURE:
			newState[action.key].loading = false;
			newState[action.key].error = action.content;
			return newState;
		case GET_OPTIONS_SUCCESS:
			newState[action.key].loading = false;
			newState[action.key].options = action.content;
			return newState;
		case VALUE_CHANGE:
			newState[action.key].value = action.content;
			newState[action.key].loading = false;
			return newState;
		case TAG_SELECTED:
			newState[action.key].currentTag = action.content;
			newState[action.key].loading = false;
			return newState;
		default:
			return state;
	}
}
