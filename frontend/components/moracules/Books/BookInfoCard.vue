<template>
    <v-hover v-slot:default="{ hover }">
        <v-card
            :elevation="hover ? 1 : 0"
            outlined
            flat
            class="pa-4 mb-4"
            style="border-radius: 10px; transition: opacity 100ms;"
            :ripple="false"
            :style="imageLoaded ? 'opacity: 1;' : 'opacity: 0;'"
            @click="$emit('click')"
        >
            <div class="d-flex">
                <v-img
                    :src="thumbnail"
                    max-width="100"
                    class="book-border"
                    @load="loaded"
                />
                <div>
                    <v-card-title style="word-break: keep-all;">
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
    data () {
        return {
            imageLoaded: false
        }
    },
    computed: {
        imgUrl () {
            const { thumbnail } = this
            return string.httpToHttps(thumbnail)
        }
    },
    methods: {
        loaded () {
            this.imageLoaded = true
            this.$emit('load', true)
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
</style>
