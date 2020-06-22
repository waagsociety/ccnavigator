import React from 'react';
import ApiClient from 'client/ApiClient'
import { buildJSXFromHTML} from "util/utility"

import InfoPanel from "containers/InfoPanel/index.js"


class GlossaryItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      termEntity:null
    };
  }

  componentDidMount() {
    var termId = this.props.match.params.id;
    //full info on this node including relationships
    ApiClient.instance().fetchContent("taxonomy_term--glossary", {tid:termId}, null, null, 0, function(terms) {
      this.setState({
        termEntity: terms[0]
      });
    }.bind(this));
  }


  /**
   * render node
   */
  render() {
    //show loading till we have fetched all
    var loading = true
    var content

    //build content view when we have all data
    if(this.state.termEntity) {
      loading = false

      var title = this.state.termEntity.attributes.name || ""
      var description = (this.state.termEntity.attributes.description || {}).value || "";
      content = buildJSXFromHTML(description);
    }

    //return the content in a modal view
    return (
      <InfoPanel loading={loading} title={title}>
        {content}
      </InfoPanel>
    )
  }

}

export default GlossaryItem;
