import { StyleSheet } from "aphrodite";

export const RawStyle = {
    "category-anchor" : { /*position top left corner of the boxes*/
      "transform-origin": "top-left"
    },
    "category-anchor-0" : { /*position top left corner of the boxes*/
      transform: "translate(90px,48px) rotate(-45deg)"
    },
    "category-anchor-1" : { /*position top left corner of the boxes*/
      transform: "translate(326px,100px) rotate(-45deg)"
    },
    "category-anchor-2" : { /*position top left corner of the boxes*/
      transform: "translate(708px,50px) rotate(-45deg)"
    },
    "category-anchor-3" : { /*position top left corner of the boxes*/
      transform: "translate(540px,440px) rotate(-45deg)"
    },
    "category-anchor-4" : { /*position top left corner of the boxes*/
      transform: "translate(158px,727px) rotate(-45deg)"
    },
    "category-anchor-3-0" : { /*position top left corner of the boxes*/
      transform: "translate(365px,450px) rotate(-45deg) scale(0.5, 0.5)"
    },
    "category-anchor-3-1" : { /*position top left corner of the boxes*/
      transform: "translate(808px,450px) rotate(-45deg) scale(0.75, 0.75)"
    },
    "category-box" : {
      background: "none",
      display: "inline-block",
      padding: "10px",
      border: "1px dashed black",
    },
    "category-box-row" : {
      background: "none"
    },
    "no-select": {
      "user-select": "none",
      "-webkit-touch-callout": "none", /* iOS Safari */
      "-webkit-user-select": "none", /* Safari */
      "-khtml-user-select": "none", /* Konqueror HTML */
      "-moz-user-select": "none", /* Firefox */
      "-ms-user-select": "none" /* Internet Explorer/Edge */
    }
};

export const Style = StyleSheet.create(RawStyle);
