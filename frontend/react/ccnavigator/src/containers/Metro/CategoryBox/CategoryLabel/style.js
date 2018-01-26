import { StyleSheet } from "aphrodite";

export const RawStyle = {
    "label": {
      background: "white",
      color: "black",
      "margin-left": "20px",
      "margin-top": "20px",
      display: "inline-block",
      padding: "5px",
      transition: "width 2s",
      "font-family": "Monaco", /* monospaced font */
      "white-space": "pre",
      ":hover": {
      },
      "text-transform": "capitalize",
      "border-radius": "5px",
      "font-size" : "8pt",
      "font-weight": "bold",
      "user-select": "none"
    },
    "dots": {
      color: "#27BDBE"
    }
};

export const Style = StyleSheet.create(RawStyle);
