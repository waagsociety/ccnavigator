//regarding tools
export const setToolStatus = (id, status) => ({
  type: 'SET_TOOL_STATUS',
  id: id,
  status: status
})

export const clearTools = () => ({
  type: 'CLEAR_TOOLS'
})

//regarding title
export const setTitle = (title) => ({
  type: 'SET_TITLE',
  title: title
})

//regarding user
export const setUser = (user) => ({
  type: 'SET_USER',
  user: user
})

//regarding language
export const setLanguage = (lang) => ({
  type: 'SET_LANGUAGE',
  language: lang
})

//regarding drag status of the map
export const setDidDrag = (status) => ({
  type: 'SET_DID_DRAG',
  didDrag: status
})

//regarding status of the info panel
export const setInfoPanel = (status) => ({
  type: 'SET_INFO_PANEL',
  infoPanel: status
})

//regarding zone status
export const setZone = (number) => ({
  type: 'SET_ZONE',
  zone: number
})

//regarding filters on content (tools) on meta data (taxonomy terms)
export const addToolFilter = (id) => ({
  type: 'ADD_TOOL_FILTER',
  id: id
})

//regarding filters on content (tools) on meta data (taxonomy terms)
export const removeToolFilter = (id) => ({
  type: 'REMOVE_TOOL_FILTER',
  id: id
})

//regarding filters on content (tools) on meta data (taxonomy terms)
export const clearToolFilters = (id) => ({
  type: 'CLEAR_TOOL_FILTERS',
  id: id
})
