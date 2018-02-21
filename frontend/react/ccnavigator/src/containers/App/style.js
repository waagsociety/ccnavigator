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
    overflow: 'hidden',
  },
  left_panel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  panel: {
    position: 'relative',
    zIndex: '100',
    flexGrow: '0',
    backgroundColor: 'white',
    padding: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 0 0.75rem 0 rgba(0,0,0,0.1)'
  }
});

export default Style;
