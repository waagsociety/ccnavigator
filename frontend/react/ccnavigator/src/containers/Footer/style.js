import { StyleSheet } from 'util/aphrodite-custom.js';

const Style = StyleSheet.create({
  'navigation': {
    marginBottom: '1em'
  },
  'navigationLink': {
    textDecoration: 'none',

    ':hover': {
      textDecoration: 'underline'
    }
  }
});

export default Style;
