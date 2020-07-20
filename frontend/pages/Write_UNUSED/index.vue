<template>
    <v-container>
        <v-fade-transition hide-on-leave>
            <v-card v-if="step === 0" max-width="800" class="ma-auto" flat>
                <v-card-title>
                    우선 읽으신 책을 선택 해 주세요 📖
                </v-card-title>
                <v-text-field
                    v-model="bookTitle"
                    hide-details="auto"
                    solo
                    flat
                    outlined
                    label="책 재목을 입력 해 주세요."
                    color="main"
                    @keydown.enter.prevent="searchBook"
                />
                <template v-if="books.length === 0">
                    <v-card flat outlined class="mt-4">
                        <v-card-title class="justify-center">
                            📕 읽으신 책을 검색해주세요!
                        </v-card-title>
                    </v-card>
                </template>
                <v-row>
                    <template v-for="(item, index) in books">
                        <v-col :key="index" cols="12" lg="6">
                            <book-info-card
                                :title="item.title"
                                :thumbnail="item.thumbnail"
                                :authors="item.authors"
                                :publisher="item.publisher"
                                @click="selectBook(item)"
                            />
                        </v-col>
                    </template>
                </v-row>
            </v-card>
        </v-fade-transition>
        <v-fade-transition hide-on-leave>
            <v-card v-if="step === 1" max-width="800" class="ma-auto" flat>
                <book-info-card
                    :title="book.title"
                    :thumbnail="book.thumbnail"
                    :authors="book.authors"
                    :publisher="book.publisher"
                    :datetime="book.datetime"
                    @click="clearStep"
                />
                <template v-for="(item, index) in items">
                    <v-card
                        :key="index"
                        :outlined="focusIndex !== index"
                        :flat="focusIndex !== index"
                        :elevation="focusIndex === index ? 5 : 0"
                        class="mb-5 input-card"
                    >
                        <v-card-title>
                            {{ item.question.text }}
                        </v-card-title>
                        <v-card-text class="pb-0">
                            <v-textarea
                                v-model="item.text"
                                solo
                                flat
                                outlined
                                auto-grow
                                color="main"
                                hide-details="auto"
                                @focusin="focusIndex = index"
                                @focusout="focusIndex = null"
                            />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn icon color="error" @click="onClickDeleteQuestion(index)">
                                <v-icon>
                                    mdi-delete-outline
                                </v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
                <v-file-input
                    v-if="false"
                    v-model="image"
                    accept="image/*"
                    label="사진을 선택해주세요"
                    color="main"
                    hide-details="auto"
                    prepend-icon="mdi-camera"
                    dense
                    solo
                    flat
                    outlined
                    class="ml-2"
                />
                <v-card-actions>
                    <v-spacer />
                    <v-dialog v-model="addDialogModel" max-width="600">
                        <template v-slot:activator="{ on }">
                            <v-btn :disabled="questions.length === 0" color="green lighten-1" text v-on="on">
                                질문 추가하기
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                질문을 선택해주세요!
                            </v-card-title>
                            <v-list>
                                <template v-for="(item, index) in questions">
                                    <v-list-item :key="index" @click="dialogOnClickSubmit(item)">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{ item.text }}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>
                            </v-list>
                            <v-card-text v-if="false">
                                <v-form ref="selectQuestion">
                                    <v-select
                                        v-model="selectedQuestion"
                                        :items="questions"
                                        item-text="text"
                                        hide-details
                                        return-object
                                        solo
                                        flat
                                        :rules="rules"
                                    />
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn text color="red lighten-1" @click="dialogOnClickCancel">
                                    취소
                                </v-btn>
                                <v-btn text color="primary" @click="dialogOnClickSubmit">
                                    추가하기
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-btn color="primary" text @click="onClickSubmit">
                        완료
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-fade-transition>
    </v-container>
</template>

<script>
import BookInfoCard from '~/components/moracules/Books/BookInfoCard'
import dbUtils from '~/utils/DbUtils'

export default {
    name: 'Write',
    middleware: ['registered'],
    components: { BookInfoCard },
    filters: {
        authors (value) {
            return value.join(', ')
        }
    },
    data () {
        return {
            step: 0,
            items: [],
            selectedQuestionIds: [],
            selectedQuestion: null,
            addDialogModel: false,
            rules: [
                v => v ? true : '질문을 선택해 주세요.'
            ],
            focusIndex: null,
            book: null,
            bookTitle: '',
            image: null
        }
    },
    computed: {
        questions () {
            return this.$store.getters['questions/items']
                .filter(item1 => this.selectedQuestionIds
                    .find(id => id === item1.id) === undefined)
        },
        books () {
            return this.$store.getters['books/items']
        },
        user () {
            return this.$store.state.auth.user
        }
    },
    async beforeMount () {
        this.step = 0
        this.book = null

        await Promise.all([
            this.$store.dispatch('questions/fetch'),
            this.$store.dispatch('books/init')
        ])
    },
    methods: {
        dialogOnClickCancel () {
            this.selectedQuestion = null
            this.addDialogModel = false
        },
        dialogOnClickSubmit (question) {
            const text = ''
            const item = { question, text }

            this.items.push(item)
            this.selectedQuestionIds.push(question.itemKey)

            this.addDialogModel = false
        },
        async onClickSubmit () {
            const { items, image } = this
            let { user, book } = this

            if (items.length < 3) {
                this.$toast.info('질문은 3개 이상 입력 해 주세요.')
                return
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
                    items,
                    url
                })

                const { userId } = user
                this.$toast.success('완료되었습니다.')
                await this.$router.push(`/u/${userId}/${data.result}`)
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }
        },
        onClickDeleteQuestion (index) {
            this.items.splice(index, 1)

            const selectedIndex = this.selectedQuestionIds.findIndex(item => item.itemKey)
            this.selectedQuestionIds.splice(selectedIndex, 1)
        },
        async searchBook () {
            const { bookTitle } = this
            try {
                await this.$store.dispatch('books/fetch', { title: bookTitle })
            } catch (e) {
                this.$toast.global.error()
            }
        },
        selectBook (book) {
            this.book = book
            this.step = 1
        },
        clearStep () {
            this.book = null
            this.step = 0
            this.items.splice(0, this.items.length)
        }
    }
}
</script>

<style scoped lang="scss">
    .input-card {
        transition: background-color 500ms, color 500ms;
        border-radius: 10px;
    }
</style>
