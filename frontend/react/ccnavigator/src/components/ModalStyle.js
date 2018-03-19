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
    right: '0.75rem',
    top: '0.75rem',
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
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  labels: {
    marginRight: '0.5rem',
  },
  label: {
    margin: '0 0.5rem 3px 0',
    padding: '3px 10px 0',
    background: 'black',
    borderRadius: labelHeight/2 + 'px',
    color: 'white',
    fontSize: '13px',
    lineHeight: labelHeight-3 + 'px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',

    ':last-child': {
      marginRight: '0'
    }
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
  description: {
    marginBottom: '3em'
  },
  box: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#fff'
  },
  boxLink: {
    display: 'block',
    textDecoration: 'none',

    ':hover': {
      boxShadow: '0 0 0.75rem 0 rgba(0,0,0,0.1)'
    }
  },
  term: {
    fontWeight: '700'
  },
  image: {
    width:"50%"
  }
});

export default Style;
