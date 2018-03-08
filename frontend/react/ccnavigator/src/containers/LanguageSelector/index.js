import React from 'react';
import { connect } from 'react-redux'
import { css } from 'util/aphrodite-custom.js';
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
      <select onChange={this.onChange.bind(this)}>
        {options}
      </select>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  language: state.language
})

LanguageSelector = connect(mapStateToProps)(LanguageSelector)

export default LanguageSelector;
