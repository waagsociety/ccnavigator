import React from 'react';


class Back extends React.Component {
  static contextTypes = {
    router: () => null
  }

  render() {
    return <span className="button-back" onClick={this.context.router.history.goBack}></span>
  }
}


export default Back;