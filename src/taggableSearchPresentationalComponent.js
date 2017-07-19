import React from 'react';
import {AsyncCreatable} from 'react-select';

export default class TaggableSearchBarPresentationalCommponent extends React.Component {
	componentWillMount(){
		this.props.onMount();
	}
	
	handleChange(values){
		this.props.onValueChange()
	}
	
	handleLoadOptions(input, callback){
		this.props.onInputChange(input)
			.then(()=>{
				setTimeout(()=>{
					const options = this.props.store[this.props.searchKey] ? this.props.store[this.props.searchKey].options : [];
					callback(null, {options, cache: false});
				}, 0);
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
		const options = store && !store.loading ? store.options : [];
		let asyncCreatableProps = {
			multi: true,
			value: values,
			options,
			name: 'search-box',
			cache: false,
			onChange: this.handleChange.bind(this),
			placeholder: 'Search or filter',
			optionRenderer: this.renderOptions.bind(this),
			valueRenderer: this.renderValue.bind(this),
			promptTextCreator: this.renderCreateText.bind(this),
			loadOptions: this.handleLoadOptions.bind(this),
			ignoreCase: false,
			isLoading: store ? store.loading : true
		};
		// Shitty workaround with bug from https://github.com/JedWatson/react-select/issues/1547
		asyncCreatableProps = store && store.options.length ? {...asyncCreatableProps, filterOptions: a=>a} : {...asyncCreatableProps};
		return (
			<div>
				<AsyncCreatable {...asyncCreatableProps}/>
			</div>
		)
	}
	
	
}
