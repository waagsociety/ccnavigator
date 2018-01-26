import { StyleSheet } from 'aphrodite';

const Style = StyleSheet.create({
    red: {
        backgroundColor: 'yellow',
        width:"600px"
    },

    blue: {
        backgroundColor: 'blue'
    },
    hover: {
        ':hover': {
            backgroundColor: 'red'
        }
    },
    small: {
        '@media (max-width: 600px)': {
            backgroundColor: 'red',
        }
    }
});

export default Style;
