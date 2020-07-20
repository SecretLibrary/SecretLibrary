<template>
    <v-hover v-slot:default="{ hover }">
        <v-btn
            :elevation="hover ? 5 : 0"
            rounded
            large
            block
            color="kakao"
            @click="loginWithKakao"
        >
            카카오톡으로 시작하기
        </v-btn>
    </v-hover>
</template>

<script>
/* eslint-disable no-undef */

const kakaoApiUrl = {
    false: 'https://developers.kakao.com/sdk/js/kakao.js',
    true: 'https://developers.kakao.com/sdk/js/kakao.min.js'
}

function initKakao (apiKey) {
    Kakao.init(apiKey)
}

function login () {
    return new Promise((resolve, reject) => {
        Kakao.Auth.login({
            success (res) {
                resolve(res)
            },
            fail (error) {
                reject(error)
            }
        })
    })
}

// function me () {
//     return new Promise((resolve, reject) => {
//         Kakao.API.request({
//             url: '/v2/user/me',
//             success (res) {
//                 resolve(res)
//             },
//             fail (error) {
//                 reject(error)
//             }
//         })
//     })
// }

function handleError (error) {
    console.error(`Kakao Login Button throw an error with ${error.target.outerHTML}`)
}

export default {
    name: 'KakaoLoginBtn',
    props: {
        apiKey: {
            type: String,
            required: true
        },
        min: {
            type: Boolean,
            default: true
        }
    },
    beforeMount () {
        const { min, apiKey } = this

        const scriptId = 'kakao_login'
        let kakaoScript = document.getElementById(scriptId)

        if (!kakaoScript) {
            kakaoScript = document.createElement('script')
            kakaoScript.src = kakaoApiUrl[min]
            kakaoScript.onload = () => initKakao(apiKey)
            kakaoScript.onerror = error => handleError(error)
            kakaoScript.id = scriptId
            document.body.appendChild(kakaoScript)
            return
        }

        if (Kakao && !Kakao.isInitialized()) {
            initKakao(apiKey)
        }
    },
    methods: {
        async loginWithKakao () {
            try {
                const data = await login()
                // const data = await me()
                this.$emit('success', data)
            } catch (e) {
                this.$emit('failure', e)
            }
        }
    }
}
</script>

<style scoped>

</style>
