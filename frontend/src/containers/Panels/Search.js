import React from 'react';
import { connect } from 'react-redux'

class Search extends React.Component {

  render() {
    return (
      <div className="panel search">
        <span className="fa-icon"></span>
        <input type="text" placeholder="search" />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

Search = connect(mapStateToProps)(Search)

export default Search
