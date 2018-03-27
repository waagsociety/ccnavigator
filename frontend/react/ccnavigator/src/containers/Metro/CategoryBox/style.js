import { StyleSheet } from "aphrodite";

export const RawStyle = {
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
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

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
