<template>
    <v-container style="max-width: 800px;">
        <v-card flat outlined class="pa-4 mb-4">
            <v-row no-gutters>
                <v-col cols="12" class="mb-4 mx-auto" style="max-width: 500px;">
                    <v-card-title class="justify-space-between">
                        {{ targetUser.userName }} 님의 서재
                        <user-avatar
                            :user="targetUser"
                            :size="80"
                        />
                    </v-card-title>
                    <v-divider />
                </v-col>
                <v-col cols="6">
                    <v-card-title class="justify-center pa-0">
                        참여횟수 👨‍💻
                    </v-card-title>
                    <v-card-title class="justify-center pa-0">
                        {{ attendedMeetings.length }} 회
                    </v-card-title>
                </v-col>
                <v-col cols="6">
                    <v-card-title class="justify-center pa-0">
                        독후감 수 📕
                    </v-card-title>
                    <v-card-title class="justify-center pa-0">
                        {{ items.length }} 개
                    </v-card-title>
                </v-col>
            </v-row>
        </v-card>
        <template v-for="(item, index) in items">
            <book-info-card
                :key="index"
                :publisher="item.book.publisher"
                :authors="item.book.authors"
                :title="item.book.title"
                :thumbnail="item.book.thumbnail"
                :datetime="item.book.datetime"
                @click="goItem(item)"
            />
        </template>
        <template v-if="items.length === 0">
            <v-card flat outlined class="d-flex flex-column">
                <v-card-title class="justify-center">
                    아직 독후감이 없어요 😓
                </v-card-title>
            </v-card>
        </template>
    </v-container>
</template>

<script>
import BookInfoCard from '~/components/moracules/Books/BookInfoCard'
import UserAvatar from '~/components/moracules/UserAvatar'
export default {
    name: 'UserId',
    components: { UserAvatar, BookInfoCard },
    async asyncData ({ params, $axios, $toast }) {
        const { userId } = params
        const result = {
            userId
        }

        try {
            const res = await $axios.get(`/articles/userId/${userId}`)
            result.items = res.data.result
        } catch (e) {
            console.error(e)
            $toast.error()
        }

        try {
            const res = await $axios.get(`/user/${userId}`)
            result.targetUser = res.data.result
        } catch (e) {
            console.error(e)
            $toast.error()
        }

        try {
            const res = await $axios.get(`/meetings/userId/${userId}`)
            result.attendedMeetings = res.data.result
        } catch (e) {
            console.error(e)
            $toast.error()
        }

        return result
    },
    methods: {
        goItem (item) {
            const { itemKey } = item
            this.$router.push(`/article/${itemKey}`)
        }
    },
    head () {
        const { targetUser } = this
        return {
            title: `${targetUser.userName}님의 서재`
        }
    }
}
</script>

<style scoped lang="scss">
    .my-info {
        border-radius: 12px;
        &-title {
            font-size: 1.5em;
        }
    }
</style>
