import React from 'react';
//import ApiClient from 'client/ApiClient';
import ApiHelper from 'client/ApiHelper';
import { connect } from 'react-redux';
import { addToolFilter, removeToolFilter } from 'actions'

class ToolFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filters:[],
      toggled: false
    };
  }

  componentDidMount() {
    //retrieve filters from backend
    ApiHelper.instance().getFilterDefintions((result) => {
      this.setState({
        filters:result
      });
    });


    /*var filterFields = ["duration", "facilitator_participant", "experience_level_facilitator", "group_size" ]
    var filters = [];
    for(var i=0;i<filterFields.length;i++) {
      var resource = `taxonomy_term--${filterFields[i]}`
      ApiClient.instance().fetchContent(resource, null, null, ["vid"], 0, function(terms, vocabulary) {
        var filter = {};
        filter.name = (((vocabulary || [])[0] || {}).attributes || {}).name;
        filter.uuid = (((vocabulary || [])[0] || {}).attributes || {}).uuid;
        filter.weight = (((vocabulary || [])[0] || {}).attributes || {}).weight || 0;
        filter.options = [];
        for(var i=0;i<terms.length;i++) {
          var option = {};
          option.name = ((terms[i]).attributes || {}).name;
          option.uuid = ((terms[i]).attributes || {}).uuid;
          filter.options.push(option);
        }
        filters.push(filter);
        if(filters.length === filterFields.length) {
          var sorted = filters.sort(function(a,b) {
            return a.weight - b.weight;
          });
          this.setState({
            filters:sorted
          })

        }
      }.bind(this));
    }*/

    //this.props.dispatch(addToolFilter("065cfb65-0fc6-49d6-a7e7-791c3d4faa4f"));
    //this.props.dispatch(addToolFilter("1dce75e9-929d-4071-a91e-a5d6db08d2f5"));
    //this.props.dispatch(addToolFilter("1dce75e9-929d-4071-a91e-a5d6db08d2f5"));
    //this.props.dispatch(addToolFilter("b1"));
    //this.props.dispatch(addToolFilter("b2"));
    //this.props.dispatch(removeToolFilter("b2"));

  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps)
    //ApiHelper.instance().buildFilter();
  }

  onToggleFiltersDisplay() {
    this.setState({
      toggled: !this.state.toggled
    })
  }

  onToggleTool(uuid) {
    if(this.props.filtersSelected.find((f) => f === uuid)) {
      this.props.dispatch(removeToolFilter(uuid));
      console.log("remove", uuid)
    } else {
      console.log("add", uuid)
      this.props.dispatch(addToolFilter(uuid));
    }
  }

  onClearAll() {
    this.props.filtersSelected.forEach((uuid) => {
      this.props.dispatch(removeToolFilter(uuid));
    })
  }

  render() {

    var clearButton = (this.props.filtersSelected.length ? <a className="button-small button-clear" onClick={() => {this.onClearAll()}}>clear all filters</a> : null)

    //individual filters with options
    var filterBoxes = this.state.filters.map((filter) => {

      var className = "tool-filter " + filter.vid
      var opts = filter.options.map(opt => {
          var className = this.props.filtersSelected.indexOf(opt.uuid) !== -1 ? "selected" : null;
          return <li className={className} key={opt.uuid} onClick={(evt) => {this.onToggleTool(opt.uuid)}}>{opt.name}</li>
      });
      return (
        <div className={className} key={filter.uuid}>
          <h4>{filter.name}</h4>
          <ul className="tool-filter-options">
            {opts}
          </ul>
        </div>
      );
    });

    var className = "tool-filters toggle"
    if(this.state.toggled) {
      className += " toggled"
    }
    return (
      <div className={className}>
        <h3 className="toggle-button" onClick={() => {this.onToggleFiltersDisplay()}}><span className="icon"></span>tool display filters</h3>
        {clearButton}
        <div className="toggle-content">
          {filterBoxes}
        </div>
      </div>
    );
  }

}

//connect the status prop to the record for this tool in redux
const mapStateToProps = (state, ownProps) => ({
  filtersSelected: state.toolFiltersApplied
})
ToolFilter = connect(mapStateToProps)(ToolFilter)

export default ToolFilter
