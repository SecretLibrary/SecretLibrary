<template>
    <v-container>
        <v-row>
            <v-col cols="12" xs="12" sm="6" lg="4" xl="3">
                <add-meeting-card />
            </v-col>
            <v-col cols="12" xs="12" sm="6" lg="4" xl="3">
                <add-place-card />
            </v-col>
            <v-col cols="12" xs="12" sm="6" lg="4" xl="3">
                <add-question-card />
            </v-col>
            <v-col cols="12" xs="12" sm="6" lg="4" xl="3">
                <hover-card>
                    <v-card-title>
                        회원 리스트
                    </v-card-title>
                    <template v-if="memberList.length > 0">
                        <v-list two-line tile>
                            <template v-for="(item, index) in memberList">
                                <v-list-item :key="index" @click="onClickMember(item)">
                                    <v-list-item-avatar>
                                        <user-avatar
                                            :user="item"
                                        />
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ item.name }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ item.email }}
                                        </v-list-item-subtitle>
                                        <v-list-item-subtitle>
                                            {{ item.userId }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-list>
                    </template>
                    <template v-else>
                        <v-card-text>
                            회원 정보가 없습니다.
                        </v-card-text>
                    </template>
                </hover-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import HoverCard from '../../components/atoms/HoverCard'
import AddMeetingCard from '~/components/organisms/AddMeetingCard'
import AddPlaceCard from '~/components/organisms/AddPlaceCard'
import AddQuestionCard from '~/components/organisms/AddQuestionCard'
import UserAvatar from '~/components/moracules/UserAvatar'

export default {
    name: 'AdminDashboard',
    components: { UserAvatar, AddQuestionCard, AddPlaceCard, AddMeetingCard, HoverCard },
    data () {
        return {
        }
    },
    computed: {
        memberList () {
            return this.$store.getters['members/items']
        }
    },
    async mounted () {
        await Promise.all([
            this.$store.dispatch('members/fetch'),
            this.$store.dispatch('meetings/fetch'),
            this.$store.dispatch('questions/fetch'),
            this.$store.dispatch('category/fetch')
        ])
        await this.$nextTick()
    },
    methods: {
        onClickMember (item) {
        }
    },
    head () {
        return {
            title: '운영진'
        }
    }
}
</script>

<style scoped>

</style>
