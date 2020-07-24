<template>
    <v-avatar
        v-if="user"
        icon
        :size="size"
    >
        <v-img
            v-if="imgUrl"
            :src="imgUrl"
            :alt="user.userName"
        />
        <v-icon v-else>
            mdi-account-circle-outline
        </v-icon>
    </v-avatar>
</template>

<script>
import string from '../../utils/String'

export default {
    name: 'UserAvatar',
    props: {
        user: {
            type: Object,
            required: true
        },
        size: {
            type: Number,
            default: 48
        },
        https: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        imgUrl () {
            const { user, https } = this
            if (!user) {
                return null
            }

            if (!user.profileImage) {
                return null
            }

            if (https) {
                return string.httpToHttps(user.profileImage)
            }
            return user.profileImage
        }
    }
}
</script>

<style scoped lang="scss">

</style>
