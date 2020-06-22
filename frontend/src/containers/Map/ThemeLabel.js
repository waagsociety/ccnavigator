import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Config from 'config/Config'

import Label from 'components/Label'

class ThemeLabel extends React.Component {

  static contextTypes = {
    router: () => null
  }

  // constructor(props) {
  //   super(props)
  // }

  handleClick(e) {
    e.preventDefault()

    if(!this.props.didDrag) {
      this.props.history.push(`${Config.mapPath}theme${this.props.id}`)
    }
  }

  render() {
    return (
      <a href={`${Config.mapPath}theme${this.props.id}`} className={`theme-label ${this.props.color}`} onClick={ this.handleClick.bind(this) }>
        <span className="theme-label-text">{this.props.name}</span>
        <Label value={this.props.count ? this.props.count : "0" } color={this.props.count ? null : "lightgray"} size={'1em'} />
      </a>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  didDrag: state.didDrag
})
ThemeLabel = connect(mapStateToProps)(ThemeLabel)

export default withRouter(ThemeLabel)
