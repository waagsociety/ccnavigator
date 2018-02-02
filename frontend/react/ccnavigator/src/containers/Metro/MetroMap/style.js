import { StyleSheet } from "aphrodite";

export const RawStyle = {
    line: {
      fill:"none",
      stroke: "#000",
      "stroke-width" : "5px"
    },
    "main-line": {
      stroke: "#27BDBE"
    },
    "sub-line-e-0": {
      stroke: "#27BDBE"
    },
    "sub-line-e-1": {
      stroke: "#FAA619"
    },
    "sub-line-e-2": {
      stroke:"none",
      fill:"#00F"
    },
    "sub-line-w-0": {
      stroke: "#522E90"
    },
    "sub-line-w-1": {
      stroke: "#FF1B22"
    },
    "sub-line-w-2": {
      stroke:"none",
      fill:"#00F"
    },
    area: {
      fill:"#ccc",
      stroke:"none"
    },
    river: {
      stroke: "#BBD5EA",
      "stroke-width": "40px",
      fill: "none"
    },
    "wide-area": {
      fill:"#e5e5e5",
      stroke:"none"
    },
    "inner-area": {
      fill:"#dbdbdb",
      stroke:"none"
    }
};

export const Style = StyleSheet.create(RawStyle);
