<template>
    <v-container style="max-width: 1124px;">
        <v-row>
            <template v-for="(article, articleIndex) in articles">
                <v-col
                    :key="articleIndex"
                    cols="12"
                    sm="10"
                    offset-sm="1"
                    md="6"
                    offset-md="0"
                >
                    <postscript-card :article="article" />
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>

<script>
import { sortByCreatedAt } from '~/utils/Object'
import PostscriptCard from '~/components/moracules/Library/PostscriptCard'

export default {
    name: 'Library',
    components: { PostscriptCard },
    async asyncData ({ $axios, error }) {
        const result = {
        }

        try {
            const res = await $axios('/articles')
            const articles = res.data.result
            result.articles = sortByCreatedAt(articles, false)
        } catch (e) {
            error(e)
        }

        return result
    }
}
</script>

<style scoped lang="scss">
</style>
