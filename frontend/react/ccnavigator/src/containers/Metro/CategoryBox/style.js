import { StyleSheet } from "aphrodite";
import { Constants } from 'config/Constants.js';

export const RawStyle = {
  'category' : {
    pointerEvents: 'none',
  },
  'sub-category' : {
    fontSize: '12px'
  },
  'category-title': {
    fontSize: '1.778em',
    lineHeight: '1.2em',
    textTransform: 'lowercase',
    marginBottom: '0',
    whiteSpace: 'nowrap',

  },
  'category-title-link': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textDecoration: 'none',
    pointerEvents: 'auto',
    WebkitUserDrag: 'none',
    transition: 'all 75ms ease',

    ':hover': {
      marginTop: '0.05rem',
      marginBottom: '-0.05rem',
      transition: 'all 0ms ease',
    }
  },
  'category-themes': {
    display: 'flex',
    flexWrap: 'wrap'
  },
  'no-select': {
    userSelect: 'none',
  }
};

export const Style = StyleSheet.create(RawStyle);
