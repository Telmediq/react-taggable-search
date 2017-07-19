import {connect} from 'react-redux';
import {createSearchBar, handleValueChange, handleInputChange} from './actions'
import {default as PresentationalComponent} from './taggableSearchPresentationalComponent';

const mapStateToProps = (state, ownProps) => {
	const searchKey = ownProps.searchKey;

	return {
		store: state.taggableSearch,
		searchKey
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const {searchKey, searchFn, tags, hiddenFilters} = {ownProps};
	
	return {
		onMount: () => {
			dispatch(createSearchBar(searchKey, searchFn, tags, hiddenFilters));
		},
		onValueChange: (values) => {
			dispatch(handleValueChange(searchKey, values, searchFn, hiddenFilters));
		},
		onInputChange: (input) => {
			const promise = new Promise((resolve, reject) => {
				dispatch(handleInputChange(searchKey, input, resolve, reject))
			});
			return promise;
		}
	}
};

const ReactTaggableSearch = connect(
	mapStateToProps,
	mapDispatchToProps
)(PresentationalComponent);

export default ReactTaggableSearch;
