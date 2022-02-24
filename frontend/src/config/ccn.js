import Home from "containers/Home.js"
import Page from "containers/Page.js"
import Map from "containers/Map"

const ccnConfig = {
  title: 'Co-Creation Navigator',
  subtitle: 'guiding you through the co-creative landscape',
  root: 'https://ccn.waag.org',
  header: true,
  footer: true,
  nav: [
    {
      path: "/",
      label: "on co-creation",
      matchPath: false
    },
    {
      path: "/navigator/",
      label: "the navigator",
      matchPath: true
    },
    {
      path: "/about",
      label: "about",
      matchPath: false
    }
  ],
  routes: [
    {
      path: "/",
      component: <Home />
    },
    {
      path: "/waags-public-research",
      component: <Page />
    },
    {
      path: "/the-power-of-co-creation",
      component: <Page />
    },
    {
      path: "/hosting-co-creation",
      component: <Page />
    },
    {
      path: "/ccn-community",
      component: <Page />
    },
    {
      path: "/about",
      component: <Page />
    },
    {
      path: "/navigator/*",
      component: <Map />
    }
  ],
  mapPath: "/navigator/",
  colors: {
    'color-bg': '#F2F2F2',
    'color-bg-hover': '#EDEDED',
    'color-text': '#000',
    'color-false': '#DA0812',
    'color-1': '#2FB6BC',
    'color-2': '#DA0812',
    'color-3': '#F6A500',
    'color-4': '#522E90'
  },
  cssImports: [
  ],
  fontFamily: {
    default: '"Maax", sans-serif',
    headings: '"Maax", sans-serif'
  },
  fontWeight: {
    default: '400',
    strong: '500',
    headings: '500'
  },
  practicesPanelTitlePrefixTaxonomy: "project",
  practiceTaxonomies: [
    "project",
    "theme"
  ]
}

export default ccnConfig;