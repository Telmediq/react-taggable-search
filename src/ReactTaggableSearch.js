import {connect} from 'react-redux';

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
		}
	}
};

export default ReactTaggableSearch;
