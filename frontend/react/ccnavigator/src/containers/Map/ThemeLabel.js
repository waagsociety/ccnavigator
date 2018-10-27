import React from 'react';
import { connect } from 'react-redux'
import Label from 'components/Label'

class ThemeLabel extends React.Component {

  static contextTypes = {
    router: () => null
  }

  handleClick(e) {
    e.preventDefault()

    if(!this.props.didDrag) {
      this.context.router.history.push(`/navigator/theme/${this.props.uuid}`)
    }
  }

  render() {
    return (
      <a href={`/navigator/theme/${this.props.uuid}`} className={`theme-label ${this.props.color}`} onClick={ this.handleClick.bind(this) }>
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

export default ThemeLabel
