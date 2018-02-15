import {StyleSheet, css} from "util/aphrodite-custom.js"
import { Constants } from 'config/Constants.js';

/**
 * global styles
 */
const Style = StyleSheet.create({
    globals: {
      '*body': {
        margin: 0,
        background: [Constants.colors.background],
        fontFamily: [Constants.font400],
        fontSize: 18
      },
      '*em': {
        fontFamily: [Constants.font400Italic],
      },
      '*h1, h2, h3, h4, h5, th, strong': {
        fontFamily: [Constants.font700],
        fontWeight: '700'
      },
      '*a': {
        transition: 'color 200ms ease'
      },
      '*div': {
        boxSizing: 'border-box'
      },
      ':focus': {
        outline: 'none'
      }
    }
});

/*
 * generate global css
 */
css(Style.globals);
