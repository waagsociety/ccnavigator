import { StyleSheet } from "aphrodite";

//const rotate = 'rotate(-0deg)'
const rotate = 'rotate(-45deg)'
const scaleSubCategory = 'scale(0.60)'

export const RawStyle = {
  'category-anchor' : { /*position top left corner of the boxes*/
    transformOrigin: 'top-left'
  },
  'category-anchor-1' : {
    transform: `translate(190px, 250px) ${rotate}`
  },
  'category-anchor-2' : {
    transform: `translate(380px, 60px) ${rotate}`
  },
  'category-anchor-3' : {
    transform: `translate(630px, 60px) ${rotate}`
  },
  'category-anchor-4' : {
    transform: `translate(620px, 680px) ${rotate}`
  },
  'category-anchor-4-1' : {
    transform: `translate(810px, 270px) ${rotate} ${scaleSubCategory}`
  },
  'category-anchor-4-2' : {
    transform: `translate(560px, 470px) ${rotate} ${scaleSubCategory}`
  },
  'category-anchor-4-3' : {
    transform: `translate(600px, 270px) ${rotate} ${scaleSubCategory}`
  },
  'category-anchor-4-4' : {
    transform: `translate(960px, 550px) ${rotate} ${scaleSubCategory}`
  },
  'category-anchor-5' : {
    transform: `translate(230px, 720px) ${rotate}`
  },
  'category-anchor-6' : {
    transform: `translate(400px, -3070px) ${rotate}`
  },
  'category-box' : {
    display: 'inline-block',
    padding: '10px',

    //':hover': {
    //  backgroundColor: 'rgba(0,0,0,0.1)'
    //}
  },
  'category-box-row' : {
    background: 'none'
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
