import {StyleSheet, css} from "util/aphrodite-custom.js"
import { Constants } from 'config/Constants.js';

/**
 * global styles
 */
const Style = StyleSheet.create({
    globals: {
      '*html, body, #root': {
        width: '100%',
        height: '100%',
        position: 'fixed'
      },
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
        fontSize: '1em',
        fontWeight: '700',
        margin: '0'
      },
      '*h1, h2': {
        lineHeight: '1.25em'
      },
      '*h3, h4': {
        lineHeight: '1.5em'
      },
      '*p': {
        margin: '0 0 1.5em',
        lineHeight: '1.5em',

        ':last-child' : {
          marginBottom: '0'
        }
      },
      '*a': {
        boxSizing: 'border-box',
        color: [Constants.colors.text],
        transition: 'color 100ms ease',
        userSelect: 'none',
      },
      '*div': {
        boxSizing: 'border-box'
      },
      '*img': {
        maxWidth: '100%',
        height: 'auto'
      },
      '*table': {
        width: '100%'
      },
      '*tr': {
        display: 'flex',
        justifyContent: 'space-around'

      },
      '*td': {
        //padding: '0 1.5rem',
        //textAlign: 'center',

        //':first-child' : {
        //  paddingLeft: '0'
        //},
        //':last-child' : {
        //  paddingRight: '0'
        //}
      },
      '*td img': {
        width: 'auto',
        height: 'auto',
        maxWidth: '250px',
        maxHeight: '125px',
      },
      '*ul': {
        margin: '1.5em 0',
        paddingLeft: '1em'
      },
      '*li': {
        lineHeight: '1.5em',
        listStyleType: 'square'
      },
      '*button': {
        cursor: 'pointer'
      },
      '*:focus': {
        outline: '0'
      },
      '*::selection': {
        background: '#000',
        color: '#FFF'
      }
    }
});

/*
 * generate global css
 */
css(Style.globals);
