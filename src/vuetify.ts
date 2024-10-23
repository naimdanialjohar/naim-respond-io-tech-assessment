import { createVuetify } from 'vuetify'
import 'vuetify/styles' // Import Vuetify styles
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi' // Optional for Material Design Icons

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VTimePicker } from 'vuetify/labs/VTimePicker'

export default createVuetify({
  components: {
    ...components,
    VTimePicker,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})
