<template>
    <client-only>
        <v-container>
            Hello Library2
        </v-container>
    </client-only>
</template>

<script>
export default {
    name: 'Library2',
    computed: {
        library () {
            return this.$store.getters['library/items']
        }
    },
    async beforeMount () {
        await this.$store.dispatch('library/fetch')
    }
}
</script>

<style scoped>

</style>
