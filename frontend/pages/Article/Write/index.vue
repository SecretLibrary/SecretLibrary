<template>
    <v-container style="max-width: 800px">
        <client-only>
            <section v-if="step === 0" class="bl mt-12">
                <div id="step1" class="bl-text">
                    우선, 이번에 소개해 주실 책을
                    <v-fade-transition>
                        <span v-show="isQueryEntered">
                            검색해주세요
                        </span>
                    </v-fade-transition>
                </div>
                <v-text-field
                    v-model="bookQuery"
                    class="bl-input mb-4 pa-0"
                    color="main"
                    placeholder="검색해주세요"
                    hide-details
                    flat
                    solo
                    autofocus
                    :outlined="isQueryEntered"
                    :class="{ 'mt-2' : isQueryEntered }"
                    style="font-size: 1.5em; font-weight: bold;"
                    @keydown.enter.prevent="searchBook"
                    @blur.prevent="searchBook"
                />
                <template v-for="(item, index) in books">
                    <v-skeleton-loader
                        :key="index"
                        :loading="loadedImages[item.thumbnail] === false"
                        type="list-item-two-line"
                    >
                        <book-info-card
                            :title="item.title"
                            :thumbnail="item.thumbnail"
                            :authors="item.authors"
                            :publisher="item.publisher"
                            @click="selectBook(item)"
                            @load="pushLoadedImages(item.thumbnail)"
                        />
                    </v-skeleton-loader>
                </template>
            </section>
            <section v-if="step === 1">
                <div class="bl-text mt-12 mb-6">
                    그 다음으로 질문을 4가지 이상 선택 해주세요
                </div>
                <v-card flat>
                    <template v-for="(question, index) in questions">
                        <div :key="index" class="bl-sub-text mb-4">
                            <v-row no-gutters>
                                <v-col cols="10" class="d-flex align-center">
                                    <span :class="{ 'selected' : selectedQuestionIndex.some(target => target === index)}">
                                        {{ question.text }}
                                    </span>
                                </v-col>
                                <v-col cols="2">
                                    <v-checkbox
                                        v-model="selectedQuestionIndex"
                                        :value="index"
                                        color="main"
                                        class="ml-auto my-input"
                                    />
                                </v-col>
                            </v-row>
                        </div>
                    </template>
                    <v-card-actions>
                        <v-btn
                            color="cancel"
                            outlined
                            style="transition: color 0.3s;"
                            @click="goBack"
                        >
                            이전
                        </v-btn>
                        <v-spacer />
                        <v-btn
                            width="120"
                            color="main"
                            outlined
                            :disabled="!isQuestionSelected"
                            style="transition: color 0.3s;"
                            @click="goQnA"
                        >
                            다음
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </section>
            <section v-if="step === 2">
                <section id="step3" class="bl">
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
                        <v-btn
                            color="cancel"
                            outlined
                            style="transition: color 0.3s;"
                            @click="goBack"
                        >
                            이전
                        </v-btn>
                        <v-spacer />
                        <v-btn
                            width="120"
                            color="main"
                            outlined
                            :disabled="!isQuestionSelected"
                            style="transition: color 0.3s;"
                            @click="onClickSubmit"
                        >
                            완료
                        </v-btn>
                    </v-card-actions>
                </section>
            </section>
        </client-only>
    </v-container>
</template>

<script>
import Vue from 'vue'
import BookInfoCard from '~/components/moracules/Books/BookInfoCard'
import dbUtils from '~/utils/DbUtils'

export default {
    name: 'Index',
    middleware: ['registered'],
    components: { BookInfoCard },
    filters: {
        authors (value) {
            return value.join(', ')
        }
    },
    data () {
        return {
            bookQuery: '',
            book: null,
            loadedImages: {},
            selectedQuestionIndex: [],
            qnaList: [],
            image: null,
            step: 0,
            rules: {
                length: len => v => (v || '').length >= len || `최소 ${len} 글자는 채워주세요 😶`,
                required: v => !!v || '입력 부탁드려요 🙄'
            }
        }
    },
    computed: {
        isQueryEntered () {
            return this.bookQuery.length > 0
        },
        isQuestionSelected () {
            return this.selectedQuestionIndex.length >= 4
        },
        questions () {
            return this.$store.getters['questions/items']
        },
        books () {
            return this.$store.getters['books/items']
        },
        user () {
            return this.$store.state.auth.user
        }
    },
    watch: {
        selectedQuestionIndex (after, before) {
            if (after.length >= 4 && after.length - before.length > 0) {
                window.scrollTo({
                    top: 1000,
                    behavior: 'smooth'
                })
            }
        },
        step () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    },
    async beforeMount () {
        this.bookQuery = ''

        await Promise.all([
            this.$store.dispatch('questions/fetch'),
            this.$store.dispatch('books/init')
        ])
    },
    methods: {
        pushLoadedImages (thumbnail) {
            Vue.set(this.loadedImages, thumbnail, true)
        },
        async searchBook () {
            const { step, bookQuery } = this

            if (step !== 0) {
                return
            }

            if (bookQuery.length === 0) {
                return
            }

            try {
                await this.$store.dispatch('books/fetch', { title: bookQuery })
                this.loadedImages = {}
                this.selectedQuestionIndex = []
            } catch (e) {
                this.$toast.global.error()
            }
        },
        async selectBook (book) {
            this.book = book
            this.bookQuery = book.title

            await this.$nextTick()

            this.step = 1
        },
        goUrl (url) {
            window.open(url, '_blank')
        },
        async goQnA () {
            const { selectedQuestionIndex, questions } = this

            if (selectedQuestionIndex.length === 0) {
                return
            }

            this.qnaList = selectedQuestionIndex.map(index => questions[index]).reduce((prev, item) => {
                prev.push({
                    question: item.text,
                    text: ''
                })
                return prev
            }, [])

            await this.$nextTick()
            this.step = 2
            await this.$nextTick()

            window.scrollTo(0, 0)
        },
        goBack () {
            this.step -= 1
        },
        async onClickSubmit () {
            const { qnaList, image } = this
            let { user, book } = this

            if (!this.$refs.form.validate()) {
                return this.$toast.info('질문은 4개 이상 입력 해 주세요.')
            }

            user = dbUtils.user(user)
            book = dbUtils.book(book)

            try {
                let url = null

                if (image !== null) {
                    const formData = new FormData()
                    formData.append('img', image)
                    const { data } = await this.$axios.post('/images', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    url = data
                }

                const { data } = await this.$axios.post('/articles', {
                    user,
                    book,
                    items: qnaList,
                    url
                })

                this.$toast.success('완료되었습니다.')
                await this.$router.push(`/article/${data.result}`)
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }
        }
    }
}
</script>

<style scoped lang="scss">

</style>
