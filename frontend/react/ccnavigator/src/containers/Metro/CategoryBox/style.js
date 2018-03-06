import { StyleSheet } from "aphrodite";

const labelHeight = 16


export const RawStyle = {
    'category-anchor' : { /*position top left corner of the boxes*/
      transformOrigin: 'top-left'
    },
    'category-anchor-1' : {
      transform: 'translate(200px, 375px) rotate(-45deg)'
    },
    'category-anchor-2' : {
      transform: 'translate(280px, 75px) rotate(-45deg)'
    },
    'category-anchor-3' : {
      transform: 'translate(625px, 100px) rotate(-45deg)'
    },
    'category-anchor-4' : {
      transform: 'translate(690px, 440px) rotate(-45deg)'
    },
    'category-anchor-4-1' : {
      transform: 'translate(515px, 450px) rotate(-45deg) scale(0.8)'
    },
    'category-anchor-4-2' : {
      transform: 'translate(958px, 450px) rotate(-45deg) scale(0.8)'
    },
    'category-anchor-5' : {
      transform: 'translate(275px, 650px) rotate(-45deg)'
    },
    'category-box' : {
      display: 'inline-block',
      padding: '10px',

      ':hover': {
        backgroundColor: 'rgba(0,0,0,0.1)'
      }
    },
    'category-box-row' : {
      background: 'none'
    },
    'zone': {
      margin: '0 0.5rem 3px 0',
      padding: '5px 7px 3px',
      background: 'black',
      borderRadius: '11px',
      color: 'white',
      fontSize: '13px',
      lineHeight: labelHeight-3 + 'px',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    },
    'category-title': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: '24px',
      textTransform: 'lowercase'
    },
    'no-select': {
      userSelect: 'none',
    }
};

export const Style = StyleSheet.create(RawStyle);
