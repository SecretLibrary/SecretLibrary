<template>
    <v-card flat>
        <v-card-title class="justify-center">
            <template v-if="error.statusCode === 404">
                페이지를 찾을 수 없어요 😥
            </template>
            <template v-else-if="error.statusCode === 403">
                권한이 없어요 🧐
            </template>
            <template v-else>
                에러가 발생했습니다 😱 ({{ error.statusCode }})
            </template>
        </v-card-title>
    </v-card>
</template>

<script>
export default {
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            pageNotFound: '오류',
            otherError: 'An error occurred'
        }
    },
    mounted () {
        if (this.error.statusCode === 401) {
            this.$auth.logout()
            this.$router.push('/login')
        }
    },
    head () {
        const title = '오류 😥' // this.error.statusCode === 404 ? this.pageNotFound : this.otherError
        return {
            title
        }
    }
}
</script>

<style scoped lang="scss">
    h1 {
        font-size: 20px;
    }

    .status-code {
        font-size: 40px;
        font-weight: 600;
        width: 100%;
        text-align: center;
    }
</style>
