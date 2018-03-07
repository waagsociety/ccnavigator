import { StyleSheet } from "aphrodite";


export const RawStyle = {
  'category-anchor' : { /*position top left corner of the boxes*/
    transformOrigin: 'top-left'
  },
  'category-anchor-1' : {
    transform: 'translate(200px, 375px) rotate(-45deg)'
  },
  'category-anchor-2' : {
    transform: 'translate(270px, 75px) rotate(-45deg)'
  },
  'category-anchor-3' : {
    transform: 'translate(625px, 100px) rotate(-45deg)'
  },
  'category-anchor-4' : {
    transform: 'translate(570px, 630px) rotate(-45deg)'
  },
  'category-anchor-4-1' : {
    transform: 'translate(710px, 200px) rotate(-45deg) scale(0.8)'
  },
  'category-anchor-4-2' : {
    transform: 'translate(800px, 450px) rotate(-45deg) scale(0.8)'
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
    margin: '0 0.25rem 3px 0',
    padding: '5px 7px 3px',
    background: 'black',
    borderRadius: '10px',
    color: 'white',
    fontSize: '12px',
    lineHeight: '12px',
    textTransform: 'uppercase',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  'zone-single': {
    width: '20px',
    padding: '5px 0px 3px',
  },
  'category-title': {
    fontSize: '24px',
    textTransform: 'lowercase',
    marginBottom: '0'
  },
  'category-title-link': {
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  'no-select': {
    userSelect: 'none',
  }
};

export const Style = StyleSheet.create(RawStyle);
