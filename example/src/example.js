import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import ReactTaggableSearch, {taggableReducer} from 'react-taggable-search';

const reducers = combineReducers({taggableSearch: taggableReducer});

const store = createStore(
	reducers,
	applyMiddleware(
		thunk
	)
);

const searchFn = (data) => {
	alert(data);
};

const App = React.createClass({
	render () {
		return (
			<Provider store={store}>
				<ReactTaggableSearch searchFn={searchFn} searchKey="uniqueKey"/>
			</Provider>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
