import React from 'react';
import { StyleSheet, css } from 'util/aphrodite-custom.js';
//import { Constants } from 'config/Constants.js';

class Back extends React.Component {
  static contextTypes = {
    router: () => null
  }

  render() {
    return <span className={css(Style.back)} onClick={this.context.router.history.goBack}>←</span>
  }
}

const Style = StyleSheet.create({
  back: {
    position: 'absolute',
    left: '0.5rem',
    top: '-1.5rem',
    textDecoration: 'none',
    color: '#FFF',
    fontSize: '1.5rem',
    lineHeight: '1.5rem',
    userSelect: 'none',
    cursor: 'pointer',
    transition: 'all 100ms ease',

    ':hover': {
      //color: [Constants.colors.red]
      transform: 'translateX(-2px)'
    }
  }
});

export default Back;