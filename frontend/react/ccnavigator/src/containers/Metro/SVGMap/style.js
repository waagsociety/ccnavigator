import { StyleSheet } from "aphrodite";

export const Style = StyleSheet.create({
  svg: {
    position: 'absolute',
    backgroundColor: '#BBD5EA'
  },
  buttons: {
    position: 'absolute',
    fontSize: '20px',
    right: '10px',
    top: '10px',
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    marginBottom: '10px',
    fontSize: '20px',
    color: '#444',
    backgroundColor: 'white',
    border: 'none',
    //borderRadius: '2px',
    boxShadow: '0 0 0.5rem 0 rgba(0,0,0,0.1)',

    ':hover': {
      color: '#000'
    }
  }
});
