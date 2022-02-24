import Map from "containers/Map"

const c4pConfig = {
  title: 'Citizen Mobility Kit',
  subtitle: 'Cities4People',
  root: 'https://cmk.cities4people.eu',
  header: true,
  nav: [
    {
      path: "https://cities4people.eu/",
      label: "go to Cities4People website"
    }
  ],
  footer: false,
  routes: [
    {
      path: "/*",
      component: <Map />
    }
  ],
  mapPath: "/",
  colors: {
    'color-bg': '#F2F2F2',
    'color-bg-hover': '#EDEDED',
    'color-text': '#111',
    'color-headings': '#000',
    'color-false': '#DA0812',
    'color-1': '#00b6ec',
    'color-2': '#004179',
    'color-3': '#004179',
    'color-4': '#004179'
  },
  cssImports: [
    'https://fonts.googleapis.com/css?family=Roboto+Condensed%3A300%2C300italic%2Cregular%2Citalic%2C700%2C700italic&ver=5.3.2'
    //'https://fonts.googleapis.com/css?family=Lato%3A100%2C100italic%2C300%2C300italic%2Cregular%2Citalic%2C700%2C700italic%2C900%2C900italic&ver=5.3.2'
  ],
  fontFamily: {
    default: '"Roboto Condensed", sans-serif',
    headings: '"Roboto Condensed", sans-serif'
  },
  fontWeight: {
    default: '300',
    strong: '700',
    headings: '700'
  },
  practicesPanelFilter: {"field_project.name":"Cities 4 People"},
  practicesPanelTitlePrefixTaxonomy: null,
  practiceTaxonomies: ["project"]
}

export default c4pConfig;