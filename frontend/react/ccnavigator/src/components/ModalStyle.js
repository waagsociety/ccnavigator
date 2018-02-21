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
    overflow: 'auto',
    textAlign: 'center',
    zIndex: '200',

    ':before': {
      content: '""',
      display: 'inline-block',
      height: '100%',
      verticalAlign: 'middle',
    },
    '@media (orientation: landscape)': {
      left: '14rem'
    }
  },
  modalContent: {
    display: 'inline-block',
    verticalAlign: 'middle',
    position: 'relative',
    width: '46rem',
    maxWidth: '100%',
    padding: '1.25rem',
    textAlign: 'left'
  },
  close: {
    position: 'absolute',
    right: '0.5rem',
    top: '0.5rem',
    textDecoration: 'none',
    color: '#000',
    fontSize: '1.5rem',
    lineHeight: '1.25rem',

    ':hover': {
      color: [Constants.colors.red]
    }
  },
  modalHeader: {
    position: 'relative',
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
    fontSize: '23px',
    fontWeight: '400'
  },
  modalBody: {
    background: [Constants.colors.background],
    padding: '2rem',
    minHeight: '20rem'
  },
  box: {
    marginBottom: '1rem',
    padding: '1rem',
    background: '#fff'
  },
  term: {
    fontWeight: '700'
  },
  image: {
    width:"50%"
  }
});

export default Style;
