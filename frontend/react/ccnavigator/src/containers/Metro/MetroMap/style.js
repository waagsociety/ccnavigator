import { StyleSheet } from "aphrodite";
import { Constants } from 'config/Constants.js';

export const RawStyle = {
  'mapText': {
    fontFamily: [Constants.fonts.defaultBold],
    fontSize: '20px',
    fontWeight: '700',
  },
  'line': {
    fill:'none',
    stroke: '#000',
    strokeWidth: '6px'
  },
  'main-line': {
    stroke: '#27BDBE'
  },
  'sub-line-e-0': {
    stroke: '#FAA619'
  },
  'sub-line-e-1': {
    stroke: '#522E90'
  },
  'sub-line-e-2': {
    stroke: '#F00',
  },
  'sub-line-w-0': {
    stroke: '#27BDBE'
  },
  'sub-line-w-1': {
    stroke: '#FF1B22'
  },
  'sub-line-w-2': {
    stroke: '#00F'
  },

  'river': {
    stroke: 'none',
    fill: '#BBD5EA'
  },
  'area': {
    fill: '#F2F2F2',
    stroke: 'none'
  },
  'wide-area': {
    fill: '#e5e5e5',
    stroke: 'none'
  },
  'inner-area': {
    fill: '#dbdbdb',
    stroke: 'none'
  },
  'central-area': {
    fill: '#ccc',
    stroke: 'none'
  },

  'station': {
    fill: 'white',
    stroke: 'black',
    strokeWidth: '3px'
  }
};

export const Style = StyleSheet.create(RawStyle);
