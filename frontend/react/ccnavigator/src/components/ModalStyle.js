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
    background: 'rgba(0,0,0,0.8)',
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
    width: '54rem',
    maxWidth: '100%',
    padding: '0.75rem',
    textAlign: 'left',
  },
  close: {
    position: 'absolute',
    right: '0.5rem',
    top: '-1.5rem',
    textDecoration: 'none',
    color: '#FFF',
    fontSize: '1.5rem',
    lineHeight: '1.25rem',
    userSelect: 'none',
    transition: 'all 100ms ease',

    ':hover': {
      //color: [Constants.colors.red]
      transform: 'scale(1.25)'
    }
  },
  modalHeader: {
    position: 'relative',
    background: '#fff',
    padding: '1.25rem',
    borderTop: '2rem solid ' + [Constants.colors.turquoise],

    '@media (orientation: landscape)': {
      padding: '2rem'
    }
  },
  labels: {
    marginRight: '0.75rem',
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    fontSize: '35px',
    margin: '0 0 1rem 0',
    textTransform: 'lowercase',

    '@media (max-width: 600px)': {
      flexDirection: 'column',
    }
  },
  subTitle: {
    fontSize: '23px',
    fontWeight: '400'
  },
  modalBody: {
    background: [Constants.colors.background],
    minHeight: '20rem',
    padding: '1.25rem',
    //borderBottom: '5px solid' + Constants.colors.turquoise,

    '@media (orientation: landscape)': {
      padding: '2rem'
    }
  },
  description: {
    marginBottom: '3em'
  },
  boxes: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 -0.5rem'
  },
  box: {
    width: 'calc(100% - 1rem)',
    margin: '0.5rem',
    padding: '1rem',
    backgroundColor: '#fff',

    '@media (orientation: landscape)': {
      width: 'calc(50% - 1rem)',
    }
  },
  boxTitle: {
    textTransform: 'lowercase'
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
  columns: {
    display: 'flex',
    flexDirection: 'row-reverse',
    margin: '0 -1rem',

    '@media (max-width: 640px)': {
      margin: '0',
      flexDirection: 'column'
    }
  },
  column: {
    margin: '0 1rem',
    width: 'calc(50% - 2rem)',

    '@media (max-width: 640px)': {
      margin: '0 0 2rem',
      width: '100%'
    }
  },
  button: {
    display: 'inline-block',
    margin: '0 1em 1em 0',
    lineHeight: '1.5em',
    padding: '0.25em 0.5em 0',
    backgroundColor: Constants.colors.turquoise,
    color: '#FFF',
    textDecoration: 'none',
    textTransform: 'lowercase',
    borderRadius: '2px',

    ':hover': {
      opacity: '0.85'
    }
  }
});

export default Style;
