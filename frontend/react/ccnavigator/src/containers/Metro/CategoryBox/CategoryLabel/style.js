import { StyleSheet } from "aphrodite";


export const RawStyle = {
  'theme': {
    background: '#FFF',
    marginRight: '0.25rem',
    marginTop: '0.3rem',
    padding: '0 0.25em',
    textTransform: 'capitalize',
    borderRadius: '1em',
    fontSize: '0.556em',
    lineHeight: '2em',
    fontWeight: 'bold',
    userSelect: 'none',
    textDecoration: 'none',
    pointerEvents: 'auto',
    WebkitUserDrag: 'none',
    transition: 'all 75ms ease',

    ':hover': {
      marginTop: '0.35rem',
      marginBottom: '-0.05rem',
      transition: 'all 0ms ease',
    }
  },
  'label': {
    display: 'inline-block',
    marginLeft: '0.5em',
    borderRadius: '1em 0 0 1em',
    fontWeight: '500'
  }
};

export const Style = StyleSheet.create(RawStyle);
