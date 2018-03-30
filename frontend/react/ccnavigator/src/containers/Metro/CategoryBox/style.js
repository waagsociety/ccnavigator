import { StyleSheet } from "aphrodite";

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
    WebkitUserDrag: 'none'

    //':hover': {
    //  color: [Constants.colors.turquoise]
    //}
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
