import {taggableReducer as reducer} from './reducer';
import * as types from './actions';

describe('taggableReducer', () => {
	const expectedInitialState = {
		autoCompleteItems: [],
		options: [],
		tags: [],
		value: [],
		loading: false,
		error: null,
		currentTag: null
	};

	it('should return the an empty state when no key is given', () => {
		expect(
			reducer(undefined, {})
		).toEqual({});
	});
	
	it('should create a new search bar with an initial state when CREATE_SEARCH_BAR is dispatched', () => {
		const key = 'someKey';
		expect(
			reducer(undefined, {type: types.CREATE_SEARCH_BAR, key, content: {tags: []}})
		).toEqual({someKey: expectedInitialState});
	});
	
	it('should reset the error state and set the loading state when GET_OPTIONS is dispatched', () => {
		const key = 'someKey';
		const expectedState = {someKey: {...expectedInitialState, loading: true, error: null}};
		expect(
			reducer({someKey: expectedInitialState}, {key, type: types.GET_OPTIONS})
		).toEqual(expectedState);
	});
	
	it('should set loading to false and the error when GET_OPTIONS_FAILURE is dispatched', () => {
		const key = 'someKey';
		const expectedState = {someKey: {...expectedInitialState, loading: false, error: {some: key}}};
		expect(
			reducer({someKey: expectedInitialState}, {key, type: types.GET_OPTIONS_FAILURE, content: {some: key}})
		).toEqual(expectedState);
	});
	
	it('should set loading to false and set the options when GET_OPTIONS_SUCCESS is dispatched', () => {
		const key = 'someKey';
		const expectedState = {someKey: {...expectedInitialState, loading: false, options: []}};
		expect(
			reducer({someKey: expectedInitialState}, {type: types.GET_OPTIONS_SUCCESS, key, content: []})
		).toEqual(expectedState);
	});
	
	it('should set the new value and set loading to false when VALUE_CHANGE is dispatched', () => {
		const key = 'someKey';
		const expectedState = {someKey: {...expectedInitialState, value: [], loading: false}};
		expect(
			reducer({someKey: expectedInitialState}, {type: types.VALUE_CHANGE, key, content: []})
		).toEqual(expectedState);
	});
	
	it('should set the current tag and set loading to false when TAG_SELECTED is dispatched', () => {
		const key = 'someKey';
		const expectedState = {someKey: {...expectedInitialState, loading: false, currentTag: {}}};
		expect(
			reducer({someKey: expectedInitialState}, {type: types.TAG_SELECTED, key, content: {}})
		).toEqual(expectedState);
	});
});
