<template>
    <v-app>
        <app-bar />
        <v-content>
            <nuxt />
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

<style scoped lang="scss">

</style>
