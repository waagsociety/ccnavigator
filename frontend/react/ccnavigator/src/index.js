import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
//custom
import reducer from './reducers'
import App from 'containers/App.js'
import StoreIO from 'client/StoreIO'
import ApiHelper from 'client/ApiHelper'

//create redux store
const store = createStore(reducer)

//instantiate singletons
/*eslint-disable no-unused-vars*/
const storeExporter = StoreIO.instance(store);
const apiHelper = ApiHelper.instance(store);
/*eslint-enable no-unused-vars*/

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
