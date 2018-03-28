import { StyleSheet } from "aphrodite";

export const Style = StyleSheet.create({
  svg: {
    position: 'absolute',
    backgroundColor: '#BBD5EA'
  },
  buttons: {
    position: 'absolute',
    right: '0.75rem',
    top: '0.75rem',
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    marginBottom: '0.75rem',
    fontSize: '1.25rem',
    color: '#444',
    backgroundColor: 'white',
    border: 'none',
    boxShadow: '0 0 0.5rem 0 rgba(0,0,0,0.1)',

    ':hover': {
      color: '#000'
    }
  }
});
