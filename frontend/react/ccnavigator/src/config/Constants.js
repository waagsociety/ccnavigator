
export const Constants = {
  'colors': {
    'text': '#000',
    'background': '#F2F2F2',
    'red': '#DA0812',
    'turquoise': '#2FB6BC',
    'yellow': '#F6A500',
    'purple': '#522E90'
  },
  'zones': {
    '1' : {
      x : 40,
      y : 370,
      color : 'turquoise'
    },
    '2' : {
      x : 220,
      y : 190,
      color : 'turquoise'
    },
    '3' : {
      x : 500,
      y : 190,
      color : 'turquoise'
    },
    '4' : {
      x : 760,
      y : 450,
      color : 'turquoise'
    },
    '4-1' : { //sessions
      x : 520,
      y : 770,
      color : 'turquoise'
    },
    '4-2' : { //technology
      x : 440,
      y : 605,
      color : 'red'
    },
    '4-3' : { //events
      x : 775,
      y : 805,
      color : 'yellow'
    },
    '4-4' : { //open labs
      x : 820,
      y : 590,
      color : 'purple'
    },
    '5' : {
      x : 130,
      y : 740,
      color : 'turquoise'
    },
    '6' : {
      x : 300,
      y : -2970,
      color : 'text'
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
