import { StyleSheet } from "aphrodite";

export const RawStyle = {
    'label': {
      background: 'white',
      color: 'black',
      marginRight: '0.5rem',
      marginTop: '0.5rem',
      display: 'inline-block',
      padding: '3px 6px',
      transition: 'width 2s',
      fontFamily: 'Monaco', /* monospaced font */
      whiteSpace: 'pre',
      textTransform: 'capitalize',
      borderRadius: '5px',
      fontSize: '7pt',
      FontWeight: 'bold',
      userSelect: 'none'
    },
    'dots': {
      color: '#27BDBE'
    }
};

export const Style = StyleSheet.create(RawStyle);
