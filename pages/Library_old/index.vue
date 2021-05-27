<template>
    <client-only>
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
                <v-col cols="12" md="12" class="py-0">
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
                <v-col cols="12" class="py-0 pb-2">
                    <infinite-loading
                        spinner="waveDot"
                        @infinite="doFetchMoreArticles"
                    >
                        <div slot="no-more">
                            더 많은 후기를 준비하도록 하겠습니다 🙆‍♂
                        </div>
                        <div slot="no-results">
                            더 많은 후기를 준비하도록 하겠습니다 🙆‍♂
                        </div>
                        <div slot="error" slot-scope="{ trigger }">
                            에러가 발생했습니.
                            <a href="" @click="trigger">여기</a> 를 눌러서 다시 시작하기
                        </div>
                    </infinite-loading>
                </v-col>
            </v-row>
        </v-container>
    </client-only>
</template>

<script>
import PostscriptCard from '~/components/moracules/Library/PostscriptCard'

export default {
    name: 'Library',
    auth: false,
    components: { PostscriptCard },
    data () {
        return {
            toolbar: {
                query: '',
                focus: false
            },
            loaded: false
        }
    },
    computed: {
        articles () {
            return this.$store.getters['articles/items']
        },
        firstTouch () {
            return this.$store.getters['articles/firstTouch']
        }
    },
    watch: {
        async 'toolbar.focus' (value) {
            await this.$nextTick()
            if (value === true) {
                this.$refs.query.focus()
            }
        }
    },
    async beforeMount () {
        if (this.firstTouch) {
            await this.$store.dispatch('articles/init')
            await this.$store.dispatch('articles/fetch')
        }
    },
    methods: {
        async doFetchMoreArticles ($state) {
            const { more } = await this.$store.dispatch('articles/fetch')
            if (more) {
                return $state.loaded()
            }
            $state.complete()
        }
    }
}
</script>

<style scoped lang="scss">
</style>
