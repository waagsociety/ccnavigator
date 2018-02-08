import {StyleSheet, css} from "util/aphrodite-custom.js"

/**
 * global styles
 */
const Style = StyleSheet.create({
    globals: {
      '*body': {
        background: '#2ae',
        margin:"0"
      }
    }
});
/*
 * generate global css
 */
css(Style.globals);
