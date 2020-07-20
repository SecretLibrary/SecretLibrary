<template>
    <v-app class="app">
        <v-fade-transition>
            <app-bar v-show="readyStateComplete" />
        </v-fade-transition>
        <v-fade-transition>
            <v-main v-show="readyStateComplete">
                <nuxt />
            </v-main>
        </v-fade-transition>
    </v-app>
</template>

<script>
import AppBar from '../components/organisms/AppBar'
export default {
    name: 'Default',
    components: { AppBar },
    data () {
        return {
            readyStateComplete: false
        }
    },
    beforeMount () {
        window.addEventListener('scroll', this.handleScroll)
    },
    beforeDestroy () {
        window.addEventListener('scroll', this.handleScroll)
    },
    mounted () {
        this.readyStateComplete = false

        document.onreadystatechange = () => {
            if (document.readyState === 'complete') {
                this.readyStateComplete = true
            }
        }
    },
    methods: {
        handleScroll () {
            const scroll = window.scrollY
            this.$store.dispatch('app/scroll', scroll)
        }
    }
}
</script>

<style scoped lang="scss">
</style>
