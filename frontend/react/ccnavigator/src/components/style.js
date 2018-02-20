import { StyleSheet } from 'util/aphrodite-custom.js';
import { Constants } from 'config/Constants.js';

const labelHeight = 20;

const Style = StyleSheet.create({
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: '#000c',

    '@media (min-width: 1224px)': {
      left: '20%'
    }
  },
  modalContent: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '0%',
    background: [Constants.colors.background],
    border: 'none',
    borderRadius: '0',
  },
  close: {
    position: 'absolute',
    right: '10px',
    top: '10px',
    textDecoration: 'none',
    color: '#000',
    fontSize: '1.5rem',
    lineHeight: '1.25rem',

    ':hover': {
      color: [Constants.colors.red]
    }
  },
  container: {
    background: '#fff',
    padding: '2rem'
  },
  titleRow: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center'
  },
  label: {
    margin: '0 1rem 3px 0',
    padding: '3px 10px 0',
    background: 'black',
    borderRadius: labelHeight/2 + 'px',
    color: 'white',
    fontSize: '13px',
    lineHeight: labelHeight-3 + 'px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  title: {
    fontSize: '35px',
    margin: '0',
    textTransform: 'lowercase'
  },
  subTitle: {
    fontSize: '24px',
    fontWeight: '400'
  }
});

export default Style;
