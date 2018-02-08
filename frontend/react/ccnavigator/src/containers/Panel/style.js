import { StyleSheet } from 'aphrodite';

const Style = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      height: "100vh",
      width: "20%"
    },
    hover: {
        ':hover': {
            backgroundColor: 'red'
        }
    }
});

export default Style;
