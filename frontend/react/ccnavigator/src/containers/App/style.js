import { StyleSheet } from 'util/aphrodite-custom.js';

const Style = StyleSheet.create({
  app_container: {
    display: 'flex',
    alignItems: 'stretch',
    alignContent: 'stretch',
    width:"100vw",
    height:"100vh",
    overflow:"hidden",

    '@media (orientation: portrait)': {
      flexDirection: 'column'
    }
  },
  map_container: {
    flexGrow: '1',
  },
  panel: {
    flexGrow: '0',
    backgroundColor: 'white',
    padding: '0.5rem',
    overflow: 'hidden'
  }
});

export default Style;
