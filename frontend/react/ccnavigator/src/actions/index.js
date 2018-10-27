//regarding tools
export const setToolStatus = (uuid, status) => ({
  type: 'SET_TOOL_STATUS',
  uuid: uuid,
  status: status
})

export const clearTools = () => ({
  type: 'CLEAR_TOOLS'
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
export const addToolFilter = (uuid) => ({
  type: 'ADD_TOOL_FILTER',
  uuid: uuid
})

//regarding filters on content (tools) on meta data (taxonomy terms)
export const removeToolFilter = (uuid) => ({
  type: 'REMOVE_TOOL_FILTER',
  uuid: uuid
})

//regarding filters on content (tools) on meta data (taxonomy terms)
export const clearToolFilters = (uuid) => ({
  type: 'CLEAR_TOOL_FILTERS',
  uuid: uuid
})
