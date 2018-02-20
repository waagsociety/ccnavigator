import { StyleSheet } from "aphrodite";

export const Style = StyleSheet.create({
  svg: {
    position: 'absolute',
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
    borderRadius: '2px',

    ':hover': {
      color: '#000'
    }
  }
});
