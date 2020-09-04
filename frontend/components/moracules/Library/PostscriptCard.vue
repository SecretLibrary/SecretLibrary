<template>
    <v-hover v-slot:default="{ hover }">
        <v-card
            flat
            class="pa-2 ma-auto border"
            :ripple="false"
            :class="{ hover }"
            @click="goArticle(article)"
        >
            <v-card-title class="text-h5 justify-center font-weight-bold">
                {{ article.book.title }}
            </v-card-title>
            <v-divider />
            <v-card-text class="pt-sm-0">
                <v-row>
                    <v-col cols="12" sm="4" class="d-flex align-center">
                        <v-img
                            :src="article.book.thumbnail"
                            max-width="180"
                            aspect-ratio="0.66"
                            class="ma-auto ma-sm-0 book-border"
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
                        <div class="d-flex justify-space-between align-center">
                            <div>
                                <v-btn color="main" aria-readonly="true" icon>
                                    <v-icon>
                                        mdi-heart
                                    </v-icon>
                                    {{ article.likey }}
                                </v-btn>
                            </div>
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
                    :user="article.userInfo"
                />
                <div class="px-2">
                    {{ article.userInfo.userName }}
                </div>
            </v-card-actions>
        </v-card>
    </v-hover>
</template>

<script>
import moment from 'moment'
import UserAvatar from '~/components/moracules/UserAvatar'

export default {
    name: 'PostscriptCard',
    components: { UserAvatar },
    filters: {
        createdAt (value) {
            return moment(value).format('YYYY년 MM월 DD일 HH시')
        }
    },
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
        }
    },
    methods: {
        goArticle (article) {
            this.$router.push(`/article/${article.itemKey}`)
        }
    }
}
</script>

<style scoped>

.hover {
    outline: #1e1e1e solid 2px;
}

</style>
