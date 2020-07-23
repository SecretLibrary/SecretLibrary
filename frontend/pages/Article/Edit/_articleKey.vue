<template>
    <client-only>
        <v-container style="max-width: 800px;">
            <section class="bl">
                <book-info-card
                    class="mb-8"
                    :title="book.title"
                    :thumbnail="book.thumbnail"
                    :authors="book.authors"
                    :publisher="book.publisher"
                    @click="goUrl(book.url)"
                />
                <v-form
                    ref="form"
                    :lazy-validation="true"
                >
                    <template v-for="(qna, qnaIndex) in qnaList">
                        <div
                            :key="`${qnaIndex}-title`"
                            class="bl-text mb-2 pl-0"
                        >
                            {{ qna.question }}
                        </div>
                        <v-textarea
                            :key="`${qnaIndex}-text-area`"
                            v-model="qna.text"
                            :rules="[rules.required, rules.length(5)]"
                            auto-grow
                            flat
                            solo
                            row="4"
                            color="main"
                            class="mb-12 note"
                        >
                            <template v-slot:message="{ message }">
                                <span class="py-2" style="font-size: 1.25em; font-weight: bold;">
                                    {{ message }}
                                </span>
                            </template>
                        </v-textarea>
                    </template>
                </v-form>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        width="120"
                        color="main"
                        outlined
                        style="transition: color 0.3s;"
                        @click="onClickSubmit"
                    >
                        완료
                    </v-btn>
                </v-card-actions>
            </section>
        </v-container>
    </client-only>
</template>

<script>
import BookInfoCard from '~/components/moracules/Books/BookInfoCard'
import dbUtils from '~/utils/DbUtils'

export default {
    name: 'ModifyArticle',
    components: { BookInfoCard },
    middleware: ['registered', 'isMyArticle'],
    async asyncData ({ params, $axios, error }) {
        const { articleKey } = params
        const result = {}

        result.articleKey = articleKey

        try {
            const res = await $axios.get(`/articles/${articleKey}`)
            const article = res.data.result
            result.article = article
            result.book = article.book
            result.qnaList = article.articleItems
            result.meetingKey = article.meetingKey
        } catch (e) {
            console.error(e)
            error(e)
        }

        return result
    },
    data () {
        return {
            rules: {
                image: null,
                length: len => v => (v || '').length >= len || `최소 ${len} 글자는 채워주세요 😶`,
                required: v => !!v || '입력 부탁드려요 🙄'
            }
        }
    },
    computed: {
        user () {
            return this.$store.state.auth.user
        }
    },
    methods: {
        async onClickSubmit () {
            const { qnaList, image, articleKey, meetingKey } = this
            let { book } = this

            if (!this.$refs.form.validate()) {
                return this.$toast.info('질문은 4개 이상 입력 해 주세요.')
            }

            book = dbUtils.book(book)

            let imageUrl = null

            if (image) {
                try {
                    const formData = new FormData()
                    formData.append('img', image)
                    const { data } = await this.$axios.post('/images', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    imageUrl = data
                } catch (e) {
                    this.$toast.error('이미지 업로드에 실패하였습니다.')
                }
            }

            try {
                await this.$axios.put(`/articles/${articleKey}`, { book, items: qnaList, imageUrl, meetingKey })

                this.$toast.success('완료되었습니다.')
                await this.$router.push(`/article/${articleKey}`)
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }
        }
    },
    head () {
        return {
            title: '독후감 수정'
        }
    }
}
</script>

<style scoped>

</style>
