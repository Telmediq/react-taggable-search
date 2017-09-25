import React from 'react';
import PropTypes from 'prop-types';
import {AsyncCreatable} from 'react-select';
import css from './taggableSearchPresentationalComponent.css';

export default class TaggableSearchBarPresentationalCommponent extends React.Component {
	componentWillMount(){
		this.props.onMount();
	}
	
	handleChange(values){
		this.props.onValueChange(values);
	}
	
	handleLoadOptions(input){
		console.log('handle load options');
		return this.props.onInputChange(input)
			.then((options)=>{
				console.log('options', options);
				return {options}
			});
	}
	
	renderOptions(option){
		if(option.tagLabel){
			return option.tagLabel;
		}
		return option.label;
	}
	
	renderValue(value){
		return `${value.tagLabel}: ${value.option ? value.option.label : ''}`;
	}
	
	renderCreateText(label){
		const currentTag = this.props.store[this.props.searchKey] ? this.props.store[this.props.searchKey].currentTag : null;
		
		if(currentTag){
			return label;
		} else {
			return `search for ${label}`;
		}
	}
	
	render(){
		const store = this.props.store[this.props.searchKey];
		const values = store ? store.value : [];

		if (!document.getElementsByTagName('head')[0].querySelector('style[id="taggable-search-container"]')) {
			// insert the style into the head
			let tag = document.createElement('style');
			tag.id = 'taggable-search-container';
			tag.innerHTML = css;
			document.getElementsByTagName('head')[0].appendChild(tag);
		}

		let asyncCreatableProps = {
			multi: true,
			value: values,
			name: 'search-box',
			cache: false,
			onChange: this.handleChange.bind(this),
			placeholder: 'Search or filter',
			optionRenderer: this.renderOptions.bind(this),
			valueRenderer: this.renderValue.bind(this),
			promptTextCreator: this.renderCreateText.bind(this),
			loadOptions: this.handleLoadOptions.bind(this),
			ignoreCase: false,
		};
		// Shitty workaround with bug from https://github.com/JedWatson/react-select/issues/1547
		asyncCreatableProps = store && store.options.length ? {...asyncCreatableProps, filterOptions: a=>a} : {...asyncCreatableProps};
		return (
			<div id="taggable-search-container">
				<AsyncCreatable {...asyncCreatableProps}/>
			</div>
		);
	}
}

TaggableSearchBarPresentationalCommponent.propTypes = {
	onInputChange: PropTypes.func.isRequired,
	onMount: PropTypes.func.isRequired,
	onValueChange: PropTypes.func.isRequired,
	searchKey: PropTypes.string.isRequired,
	store: PropTypes.object.isRequired
};
