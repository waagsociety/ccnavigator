import ccnConfig from "./ccn"
import c4pConfig from "./c4p"

const siteConfig = process.env.REACT_APP_SITE === "c4p" ? c4pConfig : ccnConfig


const Config = {
  ...siteConfig,

  endPoint: (
    process.env.NODE_ENV === 'development' && false ?
    {
      host: "ccn.localhost",
      port: "80",
      path: "drupal",
      protocol: "http"
    }
    :
    {
      host: "ccn.waag.org",
      path: "drupal",
      protocol: "https"
    }
  ),

  'filterFieldMapping': { //TODO: get this configuration from backend: /jsonapi/field_config/field_config?filter[field_name][value]=field_group_size
    'duration': 'field_duration',
    'facilitator_participant': 'field_facilitator_participant',
    'experience_level_facilitator': 'field_experience_level',
    'group_size': 'field_group_size',
    'online_offline': 'field_online_offline',
  },

  'infoPanel': {
    'width': 440,
    'breakpoint': 760
  },
  'zones': {
    '1': { x: 30, y: 400, color: 'color-1' },    // 1 FOUNDATION
    '2': { x: 210, y: 220, color: 'color-1' },   // 2 CONTEXT
    '3': { x: 490, y: 220, color: 'color-1' },   // 3 COMMUNITY
    '4': { x: 750, y: 480, color: 'color-1' },   // 4 WORKSPACE
    '4-1': { x: 510, y: 800, color: 'color-1' }, // 4-1 sessions
    '4-2': { x: 430, y: 635, color: 'color-2' }, // 4-2 technology
    '4-3': { x: 765, y: 835, color: 'color-3' }, // 4-3 events
    '4-4': { x: 810, y: 620, color: 'color-4' }, // 4-4 open labs
    '5': { x: 120, y: 770, color: 'color-1' }    // 5 ASSESSMENT
  },


}

export default Config;
