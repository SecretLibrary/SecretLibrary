<template>
    <v-app>
        <app-bar />
        <v-content>
            <v-container>
                <nuxt />
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import AppBar from '../components/organisms/AppBar'
export default {
    components: { AppBar },
    data () {
        return {}
    }
}
</script>
