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
    async asyncData ({ params, $axios }) {
        const { articleKey } = params
        const res = await $axios.get(`/articles/${articleKey}`)
        const article = res.data.result
        return {
            articleKey,
            article
        }
    }
}
</script>

<style scoped>

</style>
