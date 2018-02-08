import { StyleSheet } from 'aphrodite';

const Style = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      height: "100%",
      width: "20%",
      float: "left"
    },
    hover: {
        ':hover': {
            backgroundColor: 'red'
        }
    }
});

export default Style;
