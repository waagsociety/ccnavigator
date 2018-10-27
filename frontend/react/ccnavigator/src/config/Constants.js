
export const Constants = {
  // 'colors': {
  //   'text': '#000',
  //   'background': '#F2F2F2',
  //   'red': '#DA0812',
  //   'turquoise': '#2FB6BC',
  //   'yellow': '#F6A500',
  //   'purple': '#522E90'
  // },
  'infoPanel': {
    'width': 440,
    'breakpoint': 760
  },
  'zones': {
    '1' : {
      x : 30,
      y : 400,
      color : 'turquoise'
    },
    '2' : {
      x : 210,
      y : 220,
      color : 'turquoise'
    },
    '3' : {
      x : 490,
      y : 220,
      color : 'turquoise'
    },
    '4' : {
      x : 750,
      y : 480,
      color : 'turquoise'
    },
    '4-1' : { //sessions
      x : 510,
      y : 800,
      color : 'turquoise'
    },
    '4-2' : { //technology
      x : 430,
      y : 635,
      color : 'red'
    },
    '4-3' : { //events
      x : 765,
      y : 835,
      color : 'yellow'
    },
    '4-4' : { //open labs
      x : 810,
      y : 620,
      color : 'purple'
    },
    '5' : {
      x : 120,
      y : 770,
      color : 'turquoise'
    }
  },
  'filterFieldMapping': { //TODO: get this configuration from backend: /jsonapi/field_config/field_config?filter[field_name][value]=field_group_size
    'duration': 'field_duration',
    'facilitator_participant' : 'field_facilitator_participant',
    'experience_level_facilitator': 'field_experience_level',
    'group_size' : 'field_group_size'
  }
}
export default Constants;
