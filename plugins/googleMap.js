import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

const key = process.env.GOOGLE_MAP_KEY

Vue.use(VueGoogleMaps, {
    load: {
        key,
        libraries: 'places'
    },
    installComponents: true
})
