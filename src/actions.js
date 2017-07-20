import _ from 'lodash';
import request from 'superagent';

export const CREATE_SEARCH_BAR = 'taggableSearch/CREATE_SEARCH_BAR';
export const VALUE_CHANGE = 'taggableSearch/VALUE_CHANGE';
export const GET_OPTIONS = 'taggableSearch/GET_OPTIONS';
export const GET_OPTIONS_SUCCESS = 'taggableSearch/GET_OPTIONS_SUCCESS';
export const GET_OPTIONS_FAILURE = 'taggableSearch/GET_OPTIONS_FAILURE';
export const TAG_SELECTED = 'taggableSearch/TAG_SELECTED';

const buildQueryParams = (values = [], hiddenFilters = {}) => {
	const params = {};
	values.forEach((tag) => {
		params[tag.tagKey] = tag.option.value;
	});
	return {...hiddenFilters, ...params};
};

const fetchResource = (uri, headers = {}) => {
	return new Promise((resolve, reject) => {
		request.get(uri)
			.set(headers)
			.end((err, {body} = {}) => err ? reject(body || err) : resolve(body));
	});
};

const getDebouncedOptions = _.debounce((dispatch, state, input, searchKey, resolve) => {
	const sortByTerm = (data, term) => {
		/*
		 * Sorts two option objects by how close the search string is to the beginning of the option's name
		 * e.g. term: piz and options: [apizzetto, berpizzo, pizza, pizzeria] should resolve to
		 *      [pizza, pizzeria, apizzetto, berpizzo]
		 */
		term = term.toLowerCase();
		return data.sort((a, b) => {
			return a.label.toLowerCase().indexOf(term) < b.label.toLowerCase().indexOf(term) ? -1 : 1;
		});
	};

	if (state.currentTag && state.currentTag.optionResourceUri) {
		dispatch({
			type: GET_OPTIONS,
			key: searchKey
		});
		const uri = `${state.currentTag.optionResourceUri}?${state.currentTag.optionResourceFilterKey}=${input}`;
		fetchResource(uri, state.currentTag.optionResourceUriHeaders)
			.then((resp) => {
				resp = sortByTerm(state.currentTag.optionCreationFactory(resp), input);
				resolve();
				dispatch({
					type: GET_OPTIONS_SUCCESS,
					content: resp,
					key: searchKey
				});
			});
	} else if (state.currentTag) {
		const options = _.filter(state.currentTag.options, (option) => {
			return option.label.toLowerCase().includes(input.toLowerCase());
		});
		const result = sortByTerm(options, input);
		dispatch({
			type: GET_OPTIONS_SUCCESS,
			content: result,
			key: searchKey
		});
		resolve();
	}
}, 500, {leading: false, trailing: true});

const getUnusedTags = (state) => {
	return _.filter(state.tags, (tag)=>{
		return _.map(state.value, 'tagKey').indexOf(tag.tagKey) === -1;
	});
};

export function createSearchBar(searchKey, searchFn, tags = [], hiddenFilters = {}) {
	return (dispatch, getState) => {
		const state = getState();

		if (!state.taggableSearch[searchKey]) {
			dispatch({
				type: CREATE_SEARCH_BAR,
				key: searchKey,
				content: {searchKey, tags}
			});
		}

		if (searchFn) {
			const searchParams = state.taggableSearch[searchKey] ? state.searchBar[searchKey].value.slice() : [];
			const queryParams = buildQueryParams(searchParams, hiddenFilters);
			searchFn(queryParams);
		}
	};
}

export function handleValueChange(searchKey, searchFn, values = [], hiddenFilters = {}) {
	return (dispatch, getState) => {
		const state = getState().taggableSearch[searchKey];
		const oldValues = state.value;

		let removed = _.difference(oldValues, values);
		let added = _.difference(values, oldValues);

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
				const defaultStyle = {
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
					fetchResource(added.optionResourceUri, added.optionResourceUriHeaders)
						.then((result) => {
							dispatch({
								type: GET_OPTIONS_SUCCESS,
								content: added.optionCreationFactory(result),
								key: searchKey
							});
						})
						.catch((err) => {
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
				const searchObject = {
					tagKey: 'search',
					tagLabel: 'Search',
					option: added
				};
				values = _.reject(values, {value: added.value, label: added.label});
				values = _.concat(values, searchObject);
				dispatch({
					type: VALUE_CHANGE,
					key: searchKey,
					content: values
				});
				const queryParams = buildQueryParams(values, hiddenFilters);
				searchFn(queryParams);
			} else {
				values = _.reject(values, {label: added.label, value: added.value});
				const tags = getUnusedTags(state);
				dispatch({
					type: GET_OPTIONS_SUCCESS,
					key: searchKey,
					content: tags
				});
				const currentTag = state.currentTag;
				currentTag.option = added;
				currentTag.style = {...currentTag.tagStyle || {}};
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
				const queryParams = buildQueryParams(values, hiddenFilters);
				searchFn(queryParams);
			}
		}
	};
}

export function handleInputChange(searchKey, input, resolve) {
	return (dispatch, getState) => {
		const state = getState().taggableSearch[searchKey];

		// If there aren't any currently selected tags, filter the options based on the tags.
		// Else, fetch the options using [input] as a search param
		if (state.currentTag === null) {
			let options = _.filter(state.tags, (tag) => {
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
