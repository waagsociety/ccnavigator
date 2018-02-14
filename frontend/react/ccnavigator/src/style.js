import {StyleSheet, css} from "util/aphrodite-custom.js"

/**
 * global styles
 */

const MaaxRegular = {
  fontFamily: "Maax",
  fontStyle: "normal",
  fontWeight: "400",
  src: "url('/fonts/MaaxRegular.otf') format('opentype')"
};
const MaaxRegularItalic = {
  fontFamily: "Maax",
  fontStyle: "italic",
  fontWeight: "400",
  src: "url('/fonts/MaaxRegularItalic.otf') format('opentype')"
};
const MaaxMedium = {
  fontFamily: "Maax",
  fontStyle: "normal",
  fontWeight: "700",
  src: "url('/fonts/MaaxMedium.otf') format('opentype')"
};


const Style = StyleSheet.create({
    globals: {
      '*body': {
        margin: 0,
        background: '#2ae',
        fontFamily: [MaaxRegular],
        fontSize: 18
      },
      '*em': {
        fontFamily: [MaaxRegularItalic],
      },
      '*h1, h2, h3, h4, h5, th, strong': {
        fontFamily: [MaaxMedium],
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
