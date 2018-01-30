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

const toolsReducer = (state = [], action) => {
  switch (action.type) {
    case 'CLEAR_TOOLS':
      return [];
    case 'REMOVE_TOOL':
      return state.filter((elem) => {return (elem.uuid !== action.uuid)})
    case 'SET_TOOL_STATUS':
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

//the keys defined here are the names of the substates
const CCNavigatorApp = combineReducers({
  user: userReducer,
  language: languageReducer,
  tools: toolsReducer,
  activeEntity: entityReducer,
  zoomLevelHigh: zoomLevelReducer
})

export default CCNavigatorApp
