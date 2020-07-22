<template>
    <client-only>
        <v-container style="max-width: 800px;">
            Hello Modify
        </v-container>
    </client-only>
</template>

<script>
export default {
    name: 'ModifyArticle',
    middleware: ['registered', 'isMyArticle'],
    async asyncData ({ params, $axios, error, $auth }) {
        const { articleKey } = params
        const result = {
            articleKey
        }

        try {
            const { data } = await $axios.get(`/articles/${articleKey}`)
            result.item = data.result
        } catch (e) {
            console.error(e)
            return error(e)
        }

        return result
    }
}
</script>

<style scoped>

</style>
