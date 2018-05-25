import { setToolStatus, clearTools } from '../actions'

let instance = null;

class StoreIO {

  static instance(store) {
    if(instance) {
      return instance;
    } else if(store) {
      instance = new StoreIO(store);
      return instance;
    }
    console.error("cannot make instance of StoreIO without store")
    return null;
  }

  constructor(store) {
    this.store = store;
    this.store.subscribe(function(a,b){
      this.onStoreChanged();
    }.bind(this));
  }

  //actually import all data into redux that was stored somewhere else
  importData(stored) {
    this.store.dispatch(clearTools());
    //import tools
    if(stored.tools) {
      var tools = stored.tools || [];
      for(var i=0;i<tools.length;i++) {
        var tool = tools[i];
        this.store.dispatch(setToolStatus(tool.uuid, tool.status));
      }
    }
  }

  //actually export all data from redux that needs to be stored somewhere else
  exportData() {
    //get full state
    var fullState = this.store.getState();
    //clean stuff we do not want to export
    fullState.user = undefined;
    //return a clean state
    return JSON.parse(JSON.stringify(fullState));
  }

  onStoreChanged() {
    //console.log("StoreIO: store changed", this.store.getState())
  }

}

export default StoreIO;
