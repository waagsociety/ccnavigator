import React from 'react'
import { StyleSheet, css } from 'util/aphrodite-custom.js'


const Loading = (props) => {

  return (
    <div className={css(Style.loading)}>
      Loading...
    </div>
  )
}

const Style = StyleSheet.create({
  loading: {
    color: '#FFF',
    textAlign: 'center',
  }
});


export default Loading
