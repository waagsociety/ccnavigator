import { StyleSheet } from "aphrodite";

//const rotate = 'rotate(-0deg)'
const rotate = 'rotate(-45deg)'
const scaleSubCategory = 'scale(0.60)'

export const RawStyle = {
  'category-anchor' : { /*position top left corner of the boxes*/
    transformOrigin: 'top-left',
    //background: '#F00',
    width: '250px',
    height: '150px' 
  },
  'category-anchor-1' : {
    transform: `translate(160px, 280px) ${rotate}`
  },
  'category-anchor-2' : {
    transform: `translate(350px, 60px) ${rotate}`
  },
  'category-anchor-3' : {
    transform: `translate(650px, 60px) ${rotate}`
  },
  'category-anchor-4' : {
    transform: `translate(640px, 680px) ${rotate}`
  },
  'category-anchor-4-1' : {
    transform: `translate(820px, 270px) ${rotate} ${scaleSubCategory}`
  },
  'category-anchor-4-2' : {
    transform: `translate(560px, 465px) ${rotate} ${scaleSubCategory}`
  },
  'category-anchor-4-3' : {
    transform: `translate(850px, 690px) ${rotate} ${scaleSubCategory}`
  },
  'category-anchor-4-4' : {
    transform: `translate(960px, 470px) ${rotate} ${scaleSubCategory}`
  },
  'category-anchor-5' : {
    transform: `translate(250px, 720px) ${rotate}`
  },
  'category-anchor-6' : {
    transform: `translate(400px, -3070px) ${rotate}`
  },
  'category-box' : {
    display: 'block',
  },
  'category-title': {
    fontSize: '30px',
    lineHeight: '1.2em',
    textTransform: 'lowercase',
    marginBottom: '0',
    whiteSpace: 'nowrap'
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
  'no-select': {
    userSelect: 'none',
  }
};

export const Style = StyleSheet.create(RawStyle);
