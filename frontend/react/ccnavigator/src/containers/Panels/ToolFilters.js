import React from 'react';
//import ApiClient from 'client/ApiClient';
import ApiHelper from 'client/ApiHelper';
import { connect } from 'react-redux';
import { addToolFilter, removeToolFilter } from 'actions'

class ToolFilters extends React.Component {

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
        filter.id = (((vocabulary || [])[0] || {}).attributes || {}).id;
        filter.weight = (((vocabulary || [])[0] || {}).attributes || {}).weight || 0;
        filter.options = [];
        for(var i=0;i<terms.length;i++) {
          var option = {};
          option.name = ((terms[i]).attributes || {}).name;
          option.id = ((terms[i]).attributes || {}).id;
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
    //console.log("nextProps", nextProps)
    //ApiHelper.instance().buildFilter();
  }

  onToggleFiltersDisplay() {
    this.setState({
      toggled: !this.state.toggled
    })
  }

  onToggleTool(id) {
    if(this.props.filtersSelected.find((f) => f === id)) {
      this.props.dispatch(removeToolFilter(id));
    } else {
      this.props.dispatch(addToolFilter(id));
    }
  }

  onClearAll() {
    this.props.filtersSelected.forEach((id) => {
      this.props.dispatch(removeToolFilter(id));
    })
  }

  render() {

    var clearButton = (this.props.filtersSelected.length ? <span className="button-small button-clear" onClick={() => {this.onClearAll()}}>clear all filters</span> : null)

    //individual filters with options
    var filterBoxes = this.state.filters.map((filter) => {
      var className = "tool-filter " + filter.vid
      var opts = filter.options.map(opt => {
          var className = this.props.filtersSelected.indexOf(opt.id) !== -1 ? "selected" : null;
          return <li className={className} key={opt.id} onClick={(evt) => {this.onToggleTool(opt.id)}}>{opt.name}</li>
      });
      return (
        <div className={className} key={filter.id}>
          <h4>{filter.name}</h4>
          <ul className="tool-filter-options">
            {opts}
          </ul>
        </div>
      );
    });

    var className = "panel tool-filters toggle"
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
ToolFilters = connect(mapStateToProps)(ToolFilters)

export default ToolFilters
