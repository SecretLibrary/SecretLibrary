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
                    <v-hover v-slot:default="{ hover }">
                        <v-card
                            flat
                            max-width="500"
                            class="pa-2 ma-auto"
                            :outlined="!hover"
                            :elevation="hover ? 4 : 0"
                            @click="goArticle(article)"
                        >
                            <v-card-title class="text-h5 justify-center">
                                {{ article.book.title }}
                            </v-card-title>
                            <v-divider />
                            <v-card-text class="pt-sm-0">
                                <v-row>
                                    <v-col cols="12" sm="4" class="d-flex align-center">
                                        <v-img
                                            :src="article.book.thumbnail"
                                            max-width="140"
                                            contain
                                            class="ma-auto ma-sm-0"
                                            :class="{
                                                'book-border' : loadedImages.some(isbn => isbn === article.book.isbn)
                                            }"
                                            @load="loadedImages.push(article.book.isbn)"
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="8">
                                        <v-list max-height="220" style="overflow-y: hidden;">
                                            <template v-for="(item, index) in article.articleItems.slice(0, 3)">
                                                <v-list-item
                                                    :key="`${index}-question`"
                                                    class="px-0 px-sm-2"
                                                >
                                                    <v-list-item-content>
                                                        <v-list-item-title>
                                                            {{ item.question }}
                                                        </v-list-item-title>
                                                        <v-list-item-subtitle>
                                                            {{ item.text }}
                                                        </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </template>
                                        </v-list>
                                        <div class="text-right">
                                            ...와 {{ article.articleItems.length - 3 }}개의 질문
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-divider />
                            <v-card-actions class="px-4">
                                <div class="sub-info">
                                    {{ article.createdAt | createdAt }}
                                </div>
                                <v-spacer />
                                <user-avatar
                                    :user="article.author"
                                />
                                <div class="px-2">
                                    {{ article.author.userName }}
                                </div>
                            </v-card-actions>
                        </v-card>
                    </v-hover>
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>

<script>
import moment from 'moment'
import { sortByCreatedAt } from '~/utils/Object'
import UserAvatar from '~/components/moracules/UserAvatar'

export default {
    name: 'Library',
    components: { UserAvatar },
    filters: {
        createdAt (value) {
            return moment(value).format('YYYY년 MM월 DD일 HH시')
        }
    },
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
            loadedImages: [] //  TODO    lazyLoad 이미지 관련 컴포넌트 따로 만드는게 좋을듯.
        }
    },
    methods: {
        goArticle (article) {
            this.$router.push(`/article/${article.itemKey}`)
        }
    }
}
</script>

<style scoped lang="scss">
</style>
