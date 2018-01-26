import React from 'react';
import { connect } from 'react-redux'
import { css } from 'aphrodite';
import Style from './style.js';
import { setLanguage } from '../../actions'

class LanguageSelector extends React.Component {

  onChange(evt) {
    this.props.dispatch(setLanguage(evt.target.value));
  }

  render() {
    var languages = ["en", "nl"];
    var options = languages.map((item, index) => {
      return (<option key={index} value={item}>{item}</option>)
    });

		return (
			<span className={css(Style.container)}>
        <select onChange={this.onChange.bind(this)}>
          {options}
        </select>
      </span>
    );
	}

}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  language: state.language
})

LanguageSelector = connect(mapStateToProps)(LanguageSelector)

export default LanguageSelector;
