//regarding tools
export const setToolStatus = (uuid, status) => ({
  type: 'SET_TOOL_STATUS',
  uuid: uuid,
  status: status
})

export const removeTool = (uuid) => ({
  type: 'REMOVE_TOOL',
  uuid: uuid
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

//regarding what to show in modal window
export const setActiveEntity = (entityId, entityType) => ({
  type: 'SET_ACTIVE_ENTITY',
  entityId: entityId,
  entityType: entityType
})

//regarding zoomlevel of the map
export const setZoomLevelHigh = (high) => ({
  type: 'SET_ZOOM_LEVEL_HIGH',
  zoomLevelHigh: high
})
