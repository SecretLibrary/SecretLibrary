<template>
    <v-container style="max-width: 800px;">
        <v-card flat elevation="0">
            <v-card-title class="font-weight-bold py-0">
                아이디
            </v-card-title>
            <div class="bl-input">
                <v-text-field
                    v-model="userId"
                    class="text-h5"
                    solo
                    flat
                    readonly
                />
            </div>
            <v-card-title class="font-weight-bold py-0">
                이름
            </v-card-title>
            <div class="bl-input">
                <v-text-field
                    v-model="userName"
                    class="text-h5"
                    solo
                    flat
                />
            </div>
            <v-card-title class="font-weight-bold py-0">
                소개
            </v-card-title>
            <div class="bl-input">
                <v-text-field
                    v-model="introduce"
                    class="text-h5"
                    solo
                    flat
                    placeholder="소개글을 입력 해 주세요!"
                />
            </div>
            <v-card-title class="font-weight-bold py-0">
                사진
            </v-card-title>
            <user-avatar
                class="ml-4"
                :user="createdUser"
                :size="150"
                :https="false"
            />
            <v-file-input
                accept="image/*"
                prepend-icon="mdi-camera"
                color="main"
                solo
                flat
                show-size
                @change="onChangeImage"
            />
            <v-card-actions>
                <v-spacer />
                <v-btn
                    class="px-8"
                    color="main"
                    outlined
                    :disabled="loading"
                    @click="doSubmit"
                >
                    확인
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import UserAvatar from '~/components/moracules/UserAvatar'
import { preprocessImage } from '~/utils/imageHandler'

export default {
    name: 'Setting',
    components: { UserAvatar },
    middleware: ['registered'],
    filters: {
        introduce (value) {
            if (!value) {
                return '소개글이 없어요 😥'
            }
            return value
        }
    },
    data () {
        return {
            userName: '',
            introduce: '',
            userId: '',
            file: null,
            profileImage: '',
            loading: false
        }
    },
    computed: {
        user () {
            return this.$auth.user
        },
        createdUser () {
            const { userName, profileImage, userId } = this
            return {
                userName,
                profileImage,
                userId
            }
        }
    },
    beforeMount () {
        const { user } = this
        this.userName = user.userName
        this.introduce = user.introduce || null
        this.profileImage = user.profileImage || ''
        this.userId = user.userId
    },
    methods: {
        async onChangeImage (file) {
            if (!file) {
                return
            }

            try {
                this.loading = true
                this.file = await preprocessImage(file)
                this.profileImage = URL.createObjectURL(this.file)
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            } finally {
                this.loading = false
            }
        },
        async doSubmit () {
            const { file, userName, introduce } = this
            this.loading = true

            let profileImage = null
            if (file) {
                try {
                    const formData = new FormData()
                    formData.append('img', file, file.name)
                    const { data } = await this.$axios.post('/images', formData)
                    profileImage = data.result
                } catch (e) {
                    console.error(e)
                    this.$toast.error('이미지 업로드에 실패하였습니다.')
                }
            } else {
                profileImage = this.profileImage
            }

            try {
                await this.$axios.put('/user/updateProfile', {
                    userName,
                    introduce,
                    profileImage
                })

                this.$toast.success('성공적으로 프로필을 업데이트 했습니다 😉')
                await this.$auth.loginWith('kakao')
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }
        }
    }
}
</script>

<style scoped>

</style>
