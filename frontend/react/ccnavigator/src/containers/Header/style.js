import { StyleSheet } from 'util/aphrodite-custom.js';

const Style = StyleSheet.create({
  header_container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: '1',

    '@media (orientation: landscape)': {
      flexDirection: 'column',
    },
    '@media (orientation: portrait)': {
      flexDirection: 'row',
      //height: '1.5em',
    }

  },
  title: {
    fontSize: '1.2em',
    marginBottom: '0.5em',

    '@media (orientation: landscape)': {
      fontSize: '1.4em'
    }
  },
  subtitle: {
    fontSize: '0.9em',
    lineHeight: '1.35em'
  }
});

export default Style;
