<template>
    <v-container style="max-width: 800px;">
        <template v-if="item">
            <v-card elevation="0" flat>
                <v-card flat shaped class="border-radius mb-4">
                    <v-card-title class="py-0 pb-4">
                        <v-spacer />
                        <div
                            v-ripple
                            class="px-4 py-2 border-radius no-select pointer-click"
                            @click="goUserProfile"
                        >
                            <user-avatar
                                :user="item.author"
                                class="mr-4"
                            />
                            {{ item.author.userName }}
                        </div>
                    </v-card-title>
                    <v-card-subtitle class="text-right py-0">
                        {{ item.createdAt | createdAt }}
                    </v-card-subtitle>
                </v-card>
                <book-info-card
                    :publisher="item.book.publisher"
                    :authors="item.book.authors"
                    :title="item.book.title"
                    :thumbnail="item.book.thumbnail"
                    :datetime="item.book.datetime"
                    @click="goUrl(item.book.url)"
                />
                <v-card
                    v-if="isMine"
                    flat
                    class="mb-2"
                >
                    <v-card-actions class="py-0">
                        <v-spacer />
                        <v-btn
                            outlined
                            class="px-4"
                            color="red"
                            @click="doDeleteArticle"
                        >
                            <v-icon>
                                mdi-delete-outline
                            </v-icon>
                            삭제
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <div class="mt-8">
                    <template v-for="(article, index) in articleItems">
                        <div :key="index" class="mb-4 bl">
                            <div class="bl-text pl-0">
                                {{ article.question }}
                            </div>
                            <v-textarea
                                v-model="article.text"
                                readonly
                                auto-grow
                                flat
                                solo
                                color="main"
                                class="mb-8 note"
                            />
                        </div>
                    </template>
                </div>
            </v-card>
            <v-card
                flat
                outlined
                class="article-card"
            >
                <template v-if="comments.length > 0">
                    <v-list>
                        <v-list-item
                            v-for="(item, index) in comments"
                            :key="index"
                        >
                            <v-list-item-avatar>
                                <user-avatar
                                    :user="item.userInfo"
                                />
                            </v-list-item-avatar>
                            <v-list-item-content class="comment">
                                <h4>
                                    {{ item.userInfo.userName }}
                                </h4>
                                {{ item.comment }}
                                <p>
                                    {{ item.createdAt | createdAt }}
                                </p>
                            </v-list-item-content>
                            <v-list-item-action
                                v-if="item.userId === currentUserId"
                            >
                                <v-menu offset-x nudge-width="80">
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            icon
                                            color="main"
                                            large
                                            class="mr-2"
                                            v-on="on"
                                        >
                                            <v-icon>
                                                mdi-dots-horizontal
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list class="py-0">
                                        <v-list-item
                                            color="red lighten-1"
                                            @click="doDeleteComment(item)"
                                        >
                                            <v-list-item-content>
                                                삭제
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </template>
                <template v-else>
                    <v-card-subtitle class="text-center">
                        첫번째 댓글을 작성 해 주세요 🙂
                    </v-card-subtitle>
                </template>
                <v-card-actions>
                    <v-textarea
                        v-model="comment"
                        color="main"
                        rows="1"
                        solo
                        dense
                        flat
                        auto-grow
                        outlined
                        hide-details
                        class="mr-4"
                    />
                    <v-btn
                        icon
                        large
                        color="main"
                        class="mr-4"
                        :disabled="comment.length === 0"
                        @click="doPostComment"
                    >
                        <v-icon>
                            mdi-comment-processing-outline
                        </v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </template>
        <template v-else>
            <v-card flat class="ma-auto">
                <v-card-title class="justify-center">
                    글이 존재하지 않아요 🙄
                </v-card-title>
            </v-card>
        </template>
    </v-container>
</template>

<script>
import moment from 'moment'
import BookInfoCard from '~/components/moracules/Books/BookInfoCard'
import UserAvatar from '~/components/moracules/UserAvatar'
import { sortByCreatedAt } from '~/utils/Object'

export default {
    name: 'UserArticle',
    components: { UserAvatar, BookInfoCard },
    filters: {
        authors (value) {
            return value.join(', ')
        },
        createdAt (value) {
            return moment(value).format('YYYY년 MM월 DD일 HH시')
        }
    },
    async asyncData ({ params, $axios, $toast, error }) {
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
    },
    data () {
        return {
            commentCard: false,
            comment: '',
            comments: []
        }
    },
    computed: {
        articleItems () {
            return this.item.articleItems
        },
        currentUserId () {
            if (!this.$auth.loggedIn) {
                return null
            }

            return this.$auth.user.userId
        },
        isMine () {
            return this.item.author.userId === this.currentUserId
        },
        userId () {
            return this.item.author.userId
        }
    },
    mounted () {
        this.updateComment()
    },
    methods: {
        goUrl (url) {
            window.open(url, '_blank')
        },
        goUserProfile () {
            const { userId } = this
            this.$router.push(`/u/${userId}`)
        },
        async doDeleteArticle () {
            const { isMine, articleKey } = this

            if (!isMine) {
                return this.$toast.error('내가 쓴 글이 아니에요!')
            }

            const confirm = await this.$dialog.confirm({
                text: '정말 삭제하시겠어요?',
                title: '삭제하기'
            })

            if (!confirm) {
                return
            }

            try {
                await this.$axios.delete(`/articles/${articleKey}`)
                this.$toast.info('게시글이 삭제됬어요! 😮')
                this.$router.go(-1)
            } catch (e) {
                this.$toast.global.error()
            }
        },
        async doDeleteComment (comment) {
            const { itemKey } = comment
            try {
                await this.$axios.delete(`/comments/${itemKey}`)
                await this.updateComment()
                this.$toast.info('댓글이 삭제됬어요! 😮')
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }
        },
        async doPostComment () {
            const { comment, articleKey } = this

            if (comment.length === 0) {
                this.$toast.info('댓글을 입력해주세요 😉')
            }

            try {
                await this.$axios.post(`/comments/article/${articleKey}`, {
                    comment
                })
                this.comment = ''
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }

            await this.updateComment()
        },
        async updateComment () {
            const { articleKey } = this
            try {
                const { data } = await this.$axios.get(`/comments/article/${articleKey}`)
                this.comments = sortByCreatedAt(data.result)
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }
        }
    },
    head () {
        const { item, articleItems } = this
        return {
            title: item.book.title,
            meta: [
                ...articleItems.reduce((prev, item, index) => {
                    const result = {}
                    result.hid = index
                    result.name = item.question
                    result.content = item.text
                    prev.push(result)

                    return prev
                }, [])
            ]
        }
    }
}
</script>

<style scoped lang="scss">
    .article-card {
        border-radius: 12px;

        .v-card__text {
            p {
                margin-bottom: 4px;
            }
        }
    }

    .comment {
        color: #1e1e1e;
        font-size: 0.85em;
        word-break: keep-all;

        p {
            font-size: 0.8em;
            color: #7F828B;
            margin-bottom: 0;
        }
    }

</style>
