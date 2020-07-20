<template>
    <v-container fluid>
        <v-card flat outlined max-width="600" class="ma-auto">
            <v-card-title class="card-title">
                회원가입
            </v-card-title>
            <v-form ref="form">
                <v-card-text>
                    <v-label>
                        아이디 <span class="emphasize">*</span>
                        <div class="d-flex align-center">
                            <v-text-field
                                v-model="userId"
                                color="main"
                                outlined
                                append-icon="mdi-card-account-details"
                                type="text"
                                placeholder="아이디를 정해주세요."
                                :disabled="!duplicated"
                                hide-details
                                :rules="rules"
                            />
                            <v-btn
                                color="main"
                                large
                                text
                                class="ml-4"
                                :disabled="!duplicated || loading"
                                @click="doCheckDuplicated"
                            >
                                중복확인
                            </v-btn>
                        </div>
                    </v-label>
                </v-card-text>
                <v-card-text>
                    <v-label>
                        이메일 <span class="emphasize">*</span>
                        <v-text-field
                            v-model="email"
                            color="main"
                            outlined
                            append-icon="mdi-email"
                            type="email"
                            placeholder="이메일을 입력 해 주세요."
                            :rules="rules"
                            hide-details
                        />
                    </v-label>
                </v-card-text>
                <v-card-text>
                    <v-label>
                        이름 <span class="emphasize">*</span>
                        <v-text-field
                            v-model="name"
                            color="main"
                            outlined
                            append-icon="mdi-rename-box"
                            type="text"
                            placeholder="이름을 입력 해 주세요."
                            :rules="rules"
                            hide-details
                        />
                    </v-label>
                </v-card-text>
                <v-card-text>
                    <v-label>
                        성별 <span class="emphasize">*</span>
                        <v-row>
                            <template v-for="(item, index) in genderList">
                                <v-col :key="`${index}-gender-item`" cols="12" sm="4">
                                    <v-btn
                                        block
                                        large
                                        outlined
                                        color="main"
                                        :text="gender !== item.gender"
                                        @click="setGender(item.gender)"
                                    >
                                        {{ item.title }}
                                    </v-btn>
                                </v-col>
                            </template>
                        </v-row>
                    </v-label>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="main"
                        dark
                        block
                        large
                        elevation="1"
                        @click="doSubmit"
                    >
                        가입하기
                    </v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: 'SignUp',
    auth: false,
    data () {
        return {
            email: '',
            password: '',
            rePassword: '',
            name: '',
            userId: '',
            gender: 0,
            thumbnail: '',
            key: '',
            token: '',
            duplicated: true,
            loading: false,
            genderList: [
                {
                    title: '남자 👨',
                    gender: 0
                },
                {
                    title: '여자 👧',
                    gender: 1
                },
                {
                    title: '둘 다 아니에요 🧑‍🤝‍🧑',
                    gender: 2
                }
            ],
            rules: [
                v => !!v || '꼭 입력 해주셔야 해요'
            ]
        }
    },
    beforeMount () {
        const user = this.$auth.user
        this.name = user.userName
        this.email = user.email
        this.key = user.itemKey
        this.thumbnail = user.profileImage
    },
    methods: {
        setGender (gender) {
            this.gender = gender
        },
        async doCheckDuplicated () {
            const { userId } = this
            try {
                this.loading = true
                const { data } = await this.$axios.get(`/user/check/${userId}`)

                if (data.result) {
                    this.$toast.info('다른 아이디를 사용해 주세요 🙁', {
                        type: 'warning'
                    })
                    this.userId = ''
                    return
                }

                this.$toast.success('사용할 수 있는 아이디 입니다. 🤗')
                this.duplicated = false
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            } finally {
                this.loading = false
            }
        },
        async doSubmit () {
            if (!this.$refs.form.validate()) {
                return
            }

            const { email, gender, name, thumbnail, userId } = this

            try {
                await this.$axios.put('/user', {
                    email, gender, name, thumbnail, userId
                })
                this.$toast.success(`${name} 님. 회원가입을 축하드려요 🥳`)

                await this.$auth.loginWith('kakao')
            } catch (e) {
                console.log(e)
                this.$toast.global.error()
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>
