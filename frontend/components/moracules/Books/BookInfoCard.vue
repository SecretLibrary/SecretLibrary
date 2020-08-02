<template>
    <v-hover v-slot:default="{ hover }">
        <v-card
            flat
            class="mb-4"
            :ripple="false"
            :class="{ hover }"
            @click="$emit('click')"
        >
            <v-row dense>
                <v-col cols="3" class="d-flex justify-center">
                    <v-img
                        :src="thumbnail"
                        max-width="120"
                        width="100%"
                        aspect-ratio="0.66"
                        class="book-border"
                    />
                </v-col>
                <v-col cols="9" align-self="center">
                    <div class="d-flex justify-left align-center">
                        <div style="width: 100%;">
                            <v-card-title class="py-0" style="word-break: keep-all;">
                                {{ title }}
                            </v-card-title>
                            <dl class="book-info-detail">
                                <dt>저자</dt>
                                <dd>{{ authors | authors }}</dd>
                                <dt>출판사</dt>
                                <dd>{{ publisher }}</dd>
                                <template v-if="datetime">
                                    <dt>발간일</dt>
                                    <dd>{{ datetime | datetime }}</dd>
                                </template>
                            </dl>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-hover>
</template>

<script>
import moment from 'moment'
import string from '../../../utils/String'

export default {
    name: 'BookInfoCard',
    filters: {
        authors (value) {
            return value.join(', ')
        },
        datetime (value) {
            return moment(value).format('YYYY년 MM월 DD일')
        }
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        thumbnail: {
            type: String,
            default: ''
        },
        authors: {
            type: Array,
            default: () => []
        },
        publisher: {
            type: String,
            default: ''
        },
        datetime: {
            type: String,
            default: null
        }
    },
    computed: {
        imgUrl () {
            const { thumbnail } = this
            return string.httpToHttps(thumbnail)
        }
    }
}
</script>

<style scoped lang="scss">
    .book-info-detail {
        margin-left: 16px;
        display: block;
        width: 100%;
        font-size: 0.9em;
        color: #47494E;
        word-break: keep-all;
        dt {
            display: block;
            float: left;
            clear: both;
            line-height: 1.5;
            width: 60px;
        }
        dd {
            display: block;
            margin-inline-start: 40px;
            width: 100%;
        }
    }

    .hover {
        outline: #1e1e1e solid 2px;
    }
</style>
