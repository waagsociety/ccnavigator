import { StyleSheet } from 'util/aphrodite-custom.js';
import { Constants } from 'config/Constants.js';

const Style = StyleSheet.create({
  login_form: {
    display: 'flex',
    marginTop: '2rem',

    '@media (orientation: landscape)': {
      flexDirection: 'column',
    },
    '@media (orientation: portrait)': {
      flexDirection: 'row',
    }
  },
  input: {
    fontFamily: [Constants.fonts.default],
    backgroundColor: [Constants.colors.background],
    border: 'none',
    borderBottom: '2px solid ' + [Constants.colors.background],
    marginBottom: '0.5rem',
    padding: '0.8em 0.8em 0.6em',
    transition: 'all 200ms ease',

    ':focus': {
      borderBottomColor: [Constants.colors.turquoise]
    }
  },
  button: {
    backgroundColor: [Constants.colors.turquoise],
    color: '#FFF',
    padding: '0.8em 0.8em 0.6em',
    border: 'none',
    textTransform: 'uppercase'
  }
});

export default Style;