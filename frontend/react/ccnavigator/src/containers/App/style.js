import { StyleSheet } from 'util/aphrodite-custom.js';

const Style = StyleSheet.create({
  app_container: {
    display: 'flex',
    alignItems: 'stretch',
    alignContent: 'stretch',
    width:"100%",
    height:"100%",
    overflow:"hidden",

    '@media (orientation: portrait)': {
      flexDirection: 'column'
    }
  },
  map_container: {
    flexGrow: '1',
    overflow: 'hidden',
    touchAction: 'none'
  },
  panel: {
    position: 'relative',
    zIndex: '100',
    flexGrow: '0',
    backgroundColor: 'white',
    padding: '1rem',
    overflow: 'hidden',
    boxShadow: '0 0 0.75rem 0 rgba(0,0,0,0.1)'
  },
  header_panel: {
    padding: '0.75rem 1rem'
  },
  left_panel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
});

export default Style;
