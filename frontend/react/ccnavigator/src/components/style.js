import { StyleSheet } from 'util/aphrodite-custom.js';

const labelHeight = 24;

const Style = StyleSheet.create({
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    background: '#e5e5e5',
    border: 'none',
    borderRadius: 0,
  },
  container: {
    background: '#fff'
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
        color: 'red'
    }
  },
  row: {
    display: 'flex',
    flexFlow: 'row'
  },
  cell: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    'background': 'black',
    'border-radius': labelHeight/2,
    'color': 'white',
    'font-size': '14px',
    'line-height': labelHeight-4,
    'text-transform': 'uppercase',
    'padding': '4px 12px 0',
    'white-space': 'nowrap'
  },
  title: {
    'font-size': '34px',
    'margin': '0',
    'padding': '0 18px'
  },
  subTitle: {
    'color': 'black',
    'font-size': '24px',
  },
  inset: {
    'padding': '2rem'
  }

});

export default Style;
