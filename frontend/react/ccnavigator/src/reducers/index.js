import { combineReducers } from 'redux'

const titleReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_TITLE':
      return action.title;
    default:
      return state;
  }
}

const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.user;
    default:
      return state;
  }
}

const languageReducer = (state = "en", action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return action.language;
    default:
      return state;
  }
}

const entityReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_ENTITY':
      return action.entity;
    default:
      return state;
  }
}

const didDragReducer = (state = false, action) => {
  switch (action.type) {
    case 'SET_DID_DRAG':
      return action.didDrag
    default:
      return state;
  }
}

const infoPanelReducer = (state = false, action) => {
  switch (action.type) {
    case 'SET_INFO_PANEL':
      return action.infoPanel
    default:
      return state;
  }
}

const zoneReducer = (state = false, action) => {
  switch (action.type) {
    case 'SET_ZONE':
      return action.zone
    default:
      return state;
  }
}


/**
 *
 * state will look something like:
 * [
 *   {
 *     id:"49b44d9f-bdc5-4d12-a6fe-6ad2672ac83a",
 *     status:"DOING"
 *   },
 *   {
 *     id:"31a952cd-6588-4a7e-8da9-9428f4108703",
 *     status:"DONE"
 *   }
 * ]
 *
 */
const toolsReducer = (state = [], action) => {
  switch (action.type) {
    case 'CLEAR_TOOLS':
      return [];
    case 'SET_TOOL_STATUS':
      if(action.status === null) { //means unset
        return state.filter((elem) => {return (elem.id !== action.id)})
      }
      var newState = []
      if(state.find( elem => elem.id === action.id )) {
        newState = state.map( (elem) => {
          if(elem.id === action.id) {
            elem.status = action.status
          }
          return elem
        })
      } else {
        newState = [
          ...state,
          {
            id: action.id,
            status: action.status
          }
        ]
      }
      return newState
    default:
      return state
  }
}

/**
 * filter opts are group by filter
 * state will look something like:
 * {
 *   ef1a1f5f-3141-4aba-a653-5de6382584b3:[
 *     "1ad5f89e-bb30-4dc2-9e72-03d4dbe9ec33",
 *     "72208106-699f-4a29-870a-1bd0f6d9ea1c"
 *   ],
 *   ca883a1b-388e-4885-914e-a864329206f9:[
 *     "1dce75e9-929d-4071-a91e-a5d6db08d2f5"
 *   ]
 * }
 */
/*const toolFiltersReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CLEAR_FILTERS':
      return [];
    case 'ADD_TOOL_FILTER':
      //return old state if nothing changes
      if(state[action.idFilter] && state[action.idFilter].find( elem => elem === action.idOption )) {
        return state;
      }
      //deep clone state and add new option modify
      var newState = JSON.parse(JSON.stringify(state));
      if(!newState[action.idFilter]) {
        newState[action.idFilter] = [];
      }
      newState[action.idFilter].push(action.idOption);
      return newState;
    case 'REMOVE_TOOL_FILTER':
      //only return new state if there really is something to be removed
      if(state[action.idFilter] && state[action.idFilter].find( elem => elem === action.idOption )) {
        var newState = JSON.parse(JSON.stringify(state));
        newState[action.idFilter] = newState[action.idFilter].filter((e) => e !== action.idOption);
        return newState;
      }
      return state;
    default:
      return state
  }
}*/

/**
 * state will look something like:
 * [
 *  "1ad5f89e-bb30-4dc2-9e72-03d4dbe9ec33",
 *  "72208106-699f-4a29-870a-1bd0f6d9ea1c",
 *  "1dce75e9-929d-4071-a91e-a5d6db08d2f5"
 * ]
 */
const toolFiltersReducer = (state = [], action) => {
  switch (action.type) {
    case 'CLEAR_FILTERS':
      return [];
    case 'ADD_TOOL_FILTER':
      if(!state.find( e => e === action.id)) {
        return [...state, action.id];
      }
      return state;
    case 'REMOVE_TOOL_FILTER':
      if(state.find( e => e === action.id)) {
        return state.filter((e) => e !== action.id);
      }
      return state;
    default:
      return state
  }
}

//the keys defined here are the names of the substates
const CCNavigatorApp = combineReducers({
  title: titleReducer,
  user: userReducer,
  language: languageReducer,
  tools: toolsReducer,
  activeEntity: entityReducer,
  didDrag: didDragReducer,
  infoPanel: infoPanelReducer,
  zone: zoneReducer,
  toolFiltersApplied: toolFiltersReducer
})

export default CCNavigatorApp
