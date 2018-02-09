import { StyleSheet } from 'util/aphrodite-custom.js';

const Style = StyleSheet.create({
    row: {
      "padding": "0",
      "margin": "0",
      "display": "flex",
      "flex-direction": "row"
    },
    "cell":{
      "display": "flex",
      "flex-basis": "0"
    },
    "cell-1": {
      "flex-grow": "1",
    },
    "cell-2": {
      "flex-grow": "0",
    },
    delete: {

    }
});

export default Style;
