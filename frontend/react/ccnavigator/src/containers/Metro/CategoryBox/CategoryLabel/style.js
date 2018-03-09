import { StyleSheet } from "aphrodite";
import { Constants } from 'config/Constants.js';

export const RawStyle = {
    'label': {
      background: 'white',
      color: 'black',
      marginRight: '0.4rem',
      marginTop: '0.4rem',
      display: 'inline-block',
      padding: '0.4em 0.8em',
      transition: 'width 2s',
      //fontFamily: 'Monaco', /* monospaced font */
      whiteSpace: 'pre',
      textTransform: 'capitalize',
      borderRadius: '0.4em',
      fontSize: '8px',
      fontWeight: 'bold',
      userSelect: 'none',
      textDecoration: 'none'
    },
    'dot': {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      marginRight: '0.25em',
      backgroundColor: [Constants.colors.turquoise],
      color: '#FFF',
      borderRadius: '50%',
      textAlign: 'center'
    }
};

export const Style = StyleSheet.create(RawStyle);
