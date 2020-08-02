<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="py-0">
                <v-toolbar
                    v-if="false"
                    :collapse="!toolbar.focus"
                    :floating="!toolbar.focus"
                    :outlined="toolbar.focus"
                    class="px-2 mx-2"
                    flat
                    dense
                    tile
                >
                    <v-btn
                        icon
                        color="main"
                        :dark="toolbar.focus"
                        @click="toolbar.focus = true"
                    >
                        <v-icon>
                            mdi-magnify
                        </v-icon>
                    </v-btn>
                    <v-text-field
                        v-if="toolbar.focus"
                        ref="query"
                        v-model="toolbar.query"
                        placeholder="검색"
                        color="main"
                        solo
                        flat
                        hide-details
                        @focus="toolbar.focus = true"
                        @blur="toolbar.focus = false"
                    />
                </v-toolbar>
            </v-col>
            <v-col cols="12" md="12">
                <v-row no-gutters>
                    <template
                        v-for="(article, articleIndex) in articles"
                    >
                        <v-col
                            :key="articleIndex"
                            cols="12"
                            sm="12"
                            md="6"
                            xl="4"
                            class="px-2 pb-4"
                        >
                            <postscript-card
                                :article="article"
                            />
                        </v-col>
                    </template>
                </v-row>
            </v-col>
            <v-col
                v-if="false"
                cols="12"
                md="2"
            >
                <v-card
                    outlined
                    flat
                    class="px-2"
                >
                    <v-card-title>
                        Hello World
                    </v-card-title>
                </v-card>
            </v-col>
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
    },
    data () {
        return {
            toolbar: {
                query: '',
                focus: false
            },
            loaded: false
        }
    },
    watch: {
        async 'toolbar.focus' (value) {
            await this.$nextTick()
            if (value === true) {
                this.$refs.query.focus()
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>
