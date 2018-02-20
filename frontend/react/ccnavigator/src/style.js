import {StyleSheet, css} from "util/aphrodite-custom.js"
import { Constants } from 'config/Constants.js';

/**
 * global styles
 */
const Style = StyleSheet.create({
    globals: {
      '*body': {
        margin: '0',
        backgroundColor: [Constants.colors.background],
        fontFamily: [Constants.fonts.default],
        fontSize: '16px',

        '@media (min-width: 600px)': {
          fontSize: '18px'
        }
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
        fontSize: '1rem',
        fontWeight: '700',
        margin: '0'
      },
      '*h1, h2': {
        lineHeight: '1.2em'
      },
      '*a': {
        color: [Constants.colors.text],
        transition: 'color 200ms ease'
      },
      '*div': {
        boxSizing: 'border-box'
      },
      '*button': {
        cursor: 'pointer'
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