import { StyleSheet } from 'util/aphrodite-custom.js';

const Style = StyleSheet.create({
  header_container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    '@media (orientation: landscape)': {
      flexDirection: 'column',
    },
    '@media (orientation: portrait)': {
      flexDirection: 'row',
      height: '1.5em',
    }

  },
  title: {
    fontSize: '1.2em',
    marginBottom: '2rem'
  }
});

export default Style;
