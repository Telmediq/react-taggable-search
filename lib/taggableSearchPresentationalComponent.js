'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelect = require('react-select');

var _taggableSearchPresentationalComponentCss = require('./taggableSearchPresentationalComponent.css');

var _taggableSearchPresentationalComponentCss2 = _interopRequireDefault(_taggableSearchPresentationalComponentCss);

var TaggableSearchBarPresentationalCommponent = (function (_React$Component) {
	_inherits(TaggableSearchBarPresentationalCommponent, _React$Component);

	function TaggableSearchBarPresentationalCommponent() {
		_classCallCheck(this, TaggableSearchBarPresentationalCommponent);

		_get(Object.getPrototypeOf(TaggableSearchBarPresentationalCommponent.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(TaggableSearchBarPresentationalCommponent, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.props.onMount();
		}
	}, {
		key: 'handleChange',
		value: function handleChange(values) {
			this.props.onValueChange(values);
		}
	}, {
		key: 'handleLoadOptions',
		value: function handleLoadOptions(input, callback) {
			var _this = this;

			this.props.onInputChange(input).then(function () {
				setTimeout(function () {
					var options = _this.props.store[_this.props.searchKey] ? _this.props.store[_this.props.searchKey].options : [];
					callback(null, { options: options, cache: false });
				}, 0);
			});
		}
	}, {
		key: 'renderOptions',
		value: function renderOptions(option) {
			if (option.tagLabel) {
				return option.tagLabel;
			}
			return option.label;
		}
	}, {
		key: 'renderValue',
		value: function renderValue(value) {
			return value.tagLabel + ': ' + (value.option ? value.option.label : '');
		}
	}, {
		key: 'renderCreateText',
		value: function renderCreateText(label) {
			var currentTag = this.props.store[this.props.searchKey] ? this.props.store[this.props.searchKey].currentTag : null;

			if (currentTag) {
				return label;
			} else {
				return 'search for ' + label;
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var store = this.props.store[this.props.searchKey];
			var values = store ? store.value : [];
			var options = store && !store.loading ? store.options : [];

			if (!document.getElementsByTagName('head')[0].querySelector('style[id="taggable-search-container"]')) {
				// insert the style into the head
				var tag = document.createElement('style');
				tag.id = 'taggable-search-container';
				tag.innerHTML = _taggableSearchPresentationalComponentCss2['default'];
				document.getElementsByTagName('head')[0].appendChild(tag);
			}

			var asyncCreatableProps = {
				multi: true,
				value: values,
				options: options,
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
			asyncCreatableProps = store && store.options.length ? _extends({}, asyncCreatableProps, { filterOptions: function filterOptions(a) {
					return a;
				} }) : _extends({}, asyncCreatableProps);
			return _react2['default'].createElement(
				'div',
				{ id: 'taggable-search-container' },
				_react2['default'].createElement(_reactSelect.AsyncCreatable, asyncCreatableProps)
			);
		}
	}]);

	return TaggableSearchBarPresentationalCommponent;
})(_react2['default'].Component);

exports['default'] = TaggableSearchBarPresentationalCommponent;
module.exports = exports['default'];