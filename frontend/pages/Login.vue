<template>
    <v-container fluid>
        <v-card flat max-width="600" class="ma-auto">
            <v-card-title class="card-title">
                로그인
            </v-card-title>
            <v-card-text>
                <v-row>
                    <template v-if="true">
                        <template v-for="(item, index) in socialLoginBtnList">
                            <v-col :key="`${index}-social-login-btn`" cols="12">
                                <v-hover v-slot:default="{ hover }">
                                    <v-btn
                                        class="font-weight-bold"
                                        block
                                        x-large
                                        :elevation="hover ? 4 : 0"
                                        :color="item.color"
                                        :dark="item.dark"
                                        rounded
                                        :disabled="processing"
                                        @click="onClickSocialLogin(item)"
                                    >
                                        <img
                                            :src="images[item.provider]"
                                            style="width: 32px;"
                                            class="mr-4"
                                        >
                                        {{ item.title }}
                                    </v-btn>
                                </v-hover>
                            </v-col>
                        </template>
                    </template>
                </v-row>
            </v-card-text>
            <template v-if="false">
                <v-divider />
                <v-card-title>
                    이메일로 로그인
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        color="main"
                        outlined
                        append-icon="mdi-email"
                        type="email"
                        placeholder="이메일을 입력 해 주세요."
                        hide-details
                    />
                </v-card-text>
                <v-card-text>
                    <v-text-field
                        color="main"
                        outlined
                        append-icon="mdi-textbox-password"
                        type="password"
                        placeholder="비밀번호를 입력 해 주세요."
                        hide-details
                    />
                </v-card-text>
                <v-card-text>
                    <v-btn large block color="main" dark>
                        로그인하기
                    </v-btn>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-label>
                        아직 회원이 아니신가요?
                        <v-btn text color="main">
                            <nuxt-link to="/SignUp" class="color-main">
                                회원가입 하기
                            </nuxt-link>
                        </v-btn>
                    </v-label>
                </v-card-actions>
            </template>
        </v-card>
    </v-container>
</template>

<script>
import kakaoImage from '@/assets/images/2111683.png'

export default {
    name: 'Login',
    auth: false,
    data () {
        return {
            images: {
                kakao: kakaoImage
            },
            socialLoginBtnList: [
                { provider: 'kakao', title: '카카오톡으로 시작하기', color: 'kakao', dark: false }
            ],
            processing: false
        }
    },
    methods: {
        async onClickSocialLogin (item) {
            try {
                this.processing = true
                await this.$auth.loginWith(item.provider)
                this.processing = false
            } catch (e) {
                this.$toast.error('오류가 발생했습니당 🙅‍♂')
                console.error(e)
            }
        }
    },
    head () {
        return {
            title: '로그인'
        }
    }
}
</script>

<style scoped lang="scss">

</style>
