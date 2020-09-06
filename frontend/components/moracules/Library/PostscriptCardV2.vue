<template>
    <v-hover v-slot:default="{ hover }">
        <v-card
            flat
            outlined
            class="pa-2 ma-auto border"
            :ripple="false"
            :class="{ hover }"
            @click="goArticle(article)"
        >
            <v-card-title class="text-h5 justify-center font-weight-bold px-2">
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
                    <v-col cols="12" sm="8" class="d-flex flex-column justify-space-between">
                        <ol class="questions">
                            <template v-for="(question, index) in article.questions.slice(0, 4)">
                                <li :key="index" class="question">
                                    {{ question }}
                                </li>
                            </template>
                        </ol>
                        <div class="d-flex justify-space-between align-center">
                            <div>
                                <v-btn color="main" aria-readonly="true" icon>
                                    <v-icon>
                                        mdi-heart
                                    </v-icon>
                                    {{ article.likey }}
                                </v-btn>
                            </div>
                            <template v-if="article.questions.length > 4">
                                ...와 {{ article.questions.length - 4 }}개의 질문
                            </template>
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
    name: 'PostscriptCardV2',
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

<style scoped lang="scss">

.hover {
    outline: #1e1e1e solid 2px;
}

.questions {

    margin-bottom: 12px;

    .question {
        font-size: 1.20em;
        color: #3e3e3e;
        line-height: 1.66;
        margin-bottom: 8px;
    }
}

</style>
