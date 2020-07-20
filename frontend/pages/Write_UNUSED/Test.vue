<template>
    <client-only>
        <v-container>
            <v-row>
                <v-col cols="6">
                    <label>
                        <v-textarea
                            v-model="text"
                            class="text-area"
                            rounded
                            full-width
                            flat
                            auto-grow
                        />
                    </label>
                </v-col>
                <v-col cols="6" class="test">
                    <p v-for="(item, index) in tokens" :key="index">
                        {{ item }}
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </client-only>
</template>

<script>
export default {
    name: 'WriteTest',
    layout: 'Full',
    middleware: 'auth',
    data () {
        return {
            text: '오늘 그대의 모습은 정말로 아름다워요. 언제나 그 모습을 간직 할 수 있으면 좋겠어요. 항상 내 곁에 있어주세요.'
        }
    },
    computed: {
        tokens () {
            return this.text.split('\n')
        }
    },
    head () {
        return {
            title: '글쓰기 연습'
        }
    }
}
</script>

<style scoped lang="scss">
    .text-area {
        line-height: 35px;
        font-size: 20px;
    }

    .test {
        font-family: 'Nanum Pen Script', cursive;
        font-size: 30px;

        p {
            margin-bottom: 5px;
        }
    }
</style>
