import { StyleSheet } from "aphrodite";

export const RawStyle = {
    'category-anchor' : { /*position top left corner of the boxes*/
      transformOrigin: 'top-left'
    },
    'category-anchor-0' : { /*position top left corner of the boxes*/
      transform: 'translate(200px, 320px) rotate(-45deg)'
    },
    'category-anchor-1' : { /*position top left corner of the boxes*/
      transform: 'translate(370px, 100px) rotate(-45deg)'
    },
    'category-anchor-2' : { /*position top left corner of the boxes*/
      transform: 'translate(670px, 100px) rotate(-45deg)'
    },
    'category-anchor-3' : { /*position top left corner of the boxes*/
      transform: 'translate(690px, 440px) rotate(-45deg)'
    },
    'category-anchor-3-0' : { /*position top left corner of the boxes*/
      transform: 'translate(515px, 450px) rotate(-45deg) scale(0.7, 0.7)'
    },
    'category-anchor-3-1' : { /*position top left corner of the boxes*/
      transform: 'translate(958px, 450px) rotate(-45deg) scale(0.7, 0.7)'
    },
    'category-anchor-4' : { /*position top left corner of the boxes*/
      transform: 'translate(230px, 700px) rotate(-45deg)'
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
    'category-title': {
      textDecoration: 'none'
    },
    'no-select': {
      userSelect: 'none',
    }
};

export const Style = StyleSheet.create(RawStyle);
