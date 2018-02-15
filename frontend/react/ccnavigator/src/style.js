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
        fontFamily: [Constants.fonts.default],
        fontSize: 18
      },
      '*em': {
        fontFamily: [Constants.fonts.defaultItalic],
      },
      '*strong, th': {
        fontFamily: [Constants.fonts.defaultBold],
        fontWeight: '700'
      },
      '*h1, h2, h3, h4, h5': {
        fontFamily: [Constants.fonts.headings],
        fontWeight: '700',
        margin: '0'
      },
      '*a': {
        transition: 'color 200ms ease'
      },
      '*div': {
        boxSizing: 'border-box'
      },
      '*:focus': {
        outline: '0'
      }
    }
});

/*
 * generate global css
 */
css(Style.globals);
