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
	console.log(data);
};

const App = React.createClass({
	render () {
		const tags = [
			{
				tagKey: 'foo',
				tagLabel: 'Local Tag',
				options: [
					{
						value: '1',
						label: 'One'
					},
					{
						value: 2,
						label: 'Two'
					},
					{
						value: 3,
						label: 'Three'
					}
				]
			},
			{
				tagKey: 'bar',
				tagLabel: 'Custom Style Tag',
				tagStyle: {
					background: 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)'
				},
				options: [{value: '1', label: 'Pick Me!'}]
			},
			{
				tagKey: 'baz',
				tagLabel: 'Remote Resource Tag (Telmediq Repositories)',
				optionResourceUri: 'http://api.github.com/orgs/telmediq/repos',
				optionCreationFactory: (resp) => {
					const options = [];
					resp.forEach((repo)=>{
						options.push({value: repo.id, label: repo.name})
					});
					return options;
				}
			}
		];
		return (
			<Provider store={store}>
				<ReactTaggableSearch searchFn={searchFn} searchKey="uniqueKey" tags={tags} />
			</Provider>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
