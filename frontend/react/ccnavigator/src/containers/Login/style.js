import { StyleSheet } from 'util/aphrodite-custom.js';
import { Constants } from 'config/Constants.js';

const Style = StyleSheet.create({
  login_form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '14rem',
    marginTop: '2rem',

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
  },
  small: {
    fontSize: '0.8em',
    lineHeight: '1.35em'
  }
});

export default Style;