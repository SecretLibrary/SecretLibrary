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
                    <book-info-card
                        :key="`${index}-book-info-card`"
                        :title="item.title"
                        :thumbnail="item.thumbnail"
                        :authors="item.authors"
                        :publisher="item.publisher"
                        @click="selectBook(item)"
                    />
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
                                row-height="40"
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
                            @click="goUploadImage"
                        >
                            다음
                        </v-btn>
                    </v-card-actions>
                </section>
            </section>
            <section v-if="step === 3" class="bl">
                <div class="bl-text mt-12 mb-6">
                    마지막으로 나누고 싶은 사진이 있다면 공유해주세요!
                </div>
                <v-file-input
                    solo
                    flat
                    show-size
                    prepend-icon="mdi-camera"
                    color="main"
                    @change="onChangeImage"
                />
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
        </client-only>
    </v-container>
</template>

<script>
import BookInfoCard from '~/components/moracules/Books/BookInfoCard'
import dbUtils from '~/utils/DbUtils'
import { preprocessImage } from '~/utils/imageHandler'

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
            loading: false,
            bookQuery: '',
            book: null,
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
                this.$vuetify.goTo(1000, {
                    duration: 150,
                    offset: 0,
                    easing: 'easeInOutCubic'
                })
            }
        },
        step () {
            this.$vuetify.goTo(0, {
                duration: 150,
                offset: 0,
                easing: 'easeInOutCubic'
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
        goUrl (url) {
            window.open(url, '_blank')
        },
        goUploadImage () {
            if (!this.$refs.form.validate()) {
                return this.$toast.info('질문은 4개 이상 입력 해 주세요.')
            }
            this.step += 1
        },
        goBack () {
            this.step -= 1
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
        async goQnA () {
            const { selectedQuestionIndex, questions } = this

            if (selectedQuestionIndex.length === 0) {
                return
            }

            this.qnaList = selectedQuestionIndex
                .sort((a, b) => a > b ? 1 : -1)
                .map(index => questions[index])
                .reduce((prev, item, index) => {
                    prev.push({
                        question: item.text,
                        text: '',
                        order: index
                    })
                    return prev
                }, [])

            await this.$nextTick()
            this.step = 2
            await this.$nextTick()

            await this.$vuetify.goTo(0, {
                duration: 150,
                offset: 0,
                easing: 'easeInOutCubic'
            })
        },
        async onClickSubmit () {
            const { qnaList, image } = this
            let { user, book } = this

            user = dbUtils.user(user)
            book = dbUtils.book(book)

            let imageUrl = null

            if (image) {
                try {
                    const formData = new FormData()
                    formData.append('img', image, image.name)
                    const { data } = await this.$axios.post('/images', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    imageUrl = data.result
                } catch (e) {
                    this.$toast.error('이미지 업로드에 실패하였습니다.')
                }
            }

            try {
                const { data } = await this.$axios.post('/articles', {
                    user,
                    book,
                    items: qnaList,
                    imageUrl
                })

                this.$toast.success('완료되었습니다.')
                await this.$router.push(`/article/${data.result}`)
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }
        },
        async onChangeImage (file) {
            if (!file) {
                return
            }

            try {
                this.loading = true
                this.image = await preprocessImage(file)
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            } finally {
                this.loading = false
            }
        }
    },
    head () {
        return {
            title: '독후감 쓰기'
        }
    }
}
</script>

<style scoped lang="scss">

</style>
