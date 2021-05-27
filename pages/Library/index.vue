<template>
    <client-only>
        <v-container>
            <v-row>
                <v-col cols="12" md="12" class="py-0">
                    <v-row no-gutters>
                        <template
                            v-for="(article, articleIndex) in library"
                        >
                            <v-col
                                :key="articleIndex"
                                cols="12"
                                sm="12"
                                md="6"
                                xl="4"
                                class="px-2 pb-4"
                            >
                                <postscript-card-v2
                                    :article="article"
                                />
                            </v-col>
                        </template>
                    </v-row>
                </v-col>
                <!-- loader 자리 -->
                <v-col cols="12" class="py-0 pb-2">
                    <infinite-loading
                        spinner="waveDots"
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
import PostscriptCardV2 from '@/components/moracules/Library/PostscriptCardV2'

export default {
    name: 'Library',
    auth: false,
    components: {
        PostscriptCardV2
    },
    computed: {
        library () {
            return this.$store.getters['library/items']
        }
    },
    mounted () {
        this.$store.dispatch('library/fetch')
    },
    methods: {
        async doFetchMoreArticles ($state) {
            const { more } = await this.$store.dispatch('library/fetch')
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
