import { combineReducers } from 'redux'

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

const zoomLevelReducer = (state = false, action) => {
  switch (action.type) {
    case 'SET_ZOOM_LEVEL_HIGH':
      return action.zoomLevelHigh
    default:
      return state;
  }
}

/**
 *
 * state will look something like:
 * [
 *   {
 *     uuid:"49b44d9f-bdc5-4d12-a6fe-6ad2672ac83a",
 *     status:"DOING"
 *   },
 *   {
 *     uuid:"31a952cd-6588-4a7e-8da9-9428f4108703",
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
        return state.filter((elem) => {return (elem.uuid !== action.uuid)})
      }
      var newState = []
      if(state.find( elem => elem.uuid === action.uuid )) {
        newState = state.map( (elem) => {
          if(elem.uuid === action.uuid) {
            elem.status = action.status
          }
          return elem
        })
      } else {
        newState = [
          ...state,
          {
            uuid: action.uuid,
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
      if(state[action.uuidFilter] && state[action.uuidFilter].find( elem => elem === action.uuidOption )) {
        return state;
      }
      //deep clone state and add new option modify
      var newState = JSON.parse(JSON.stringify(state));
      if(!newState[action.uuidFilter]) {
        newState[action.uuidFilter] = [];
      }
      newState[action.uuidFilter].push(action.uuidOption);
      return newState;
    case 'REMOVE_TOOL_FILTER':
      //only return new state if there really is something to be removed
      if(state[action.uuidFilter] && state[action.uuidFilter].find( elem => elem === action.uuidOption )) {
        var newState = JSON.parse(JSON.stringify(state));
        newState[action.uuidFilter] = newState[action.uuidFilter].filter((e) => e !== action.uuidOption);
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
      if(!state.find( e => e === action.uuid)) {
        return [...state, action.uuid];
      }
      return state;
    case 'REMOVE_TOOL_FILTER':
      if(state.find( e => e === action.uuid)) {
        return state.filter((e) => e !== action.uuid);
      }
      return state;
    default:
      return state
  }
}

//the keys defined here are the names of the substates
const CCNavigatorApp = combineReducers({
  user: userReducer,
  language: languageReducer,
  tools: toolsReducer,
  activeEntity: entityReducer,
  zoomLevelHigh: zoomLevelReducer,
  toolFiltersApplied: toolFiltersReducer
})

export default CCNavigatorApp
