<template>
    <hover-card>
        <v-card-title>
            모임
        </v-card-title>
        <template v-if="itemList.length > 0">
            <v-card-text class="pa-0">
                <v-list>
                    <template v-for="(item, index) in itemList">
                        <v-list-item :key="index" :disabled="item.state === 'CLOSE'">
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ item.title }} [{{ item.size }}]
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    모임장 : {{ item.hostName }}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    장소 : {{ item.placeTitle }}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    시간 : {{ convertTimeString(item.startDate) }} ~ {{ convertTimeString(item.endDate) }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-menu offset-x min-width="120">
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon v-on="on">
                                            <v-icon>
                                                mdi-dots-vertical
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="changeState(item.id, 'CLOSE')">
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    닫기
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item @click="changeState(item.id, 'OPEN')">
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    열기
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item @click="changeState(item.id, 'PENDING')">
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    대기
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </v-list>
            </v-card-text>
        </template>
        <template v-else>
            <v-card-text>
                항목 없음
            </v-card-text>
        </template>
        <v-card-actions>
            <v-spacer />
            <input-form-dialog title="모임 추가하기" :input-list="inputList" :items="placeList" @submit="submit" />
        </v-card-actions>
    </hover-card>
</template>

<script>
import moment from 'moment'
import InputFormDialog from '~/components/moracules/InputFormDialog'
import HoverCard from '~/components/atoms/HoverCard'

export default {
    name: 'AddMeetingDialog',
    components: { InputFormDialog, HoverCard },
    data () {
        return {
            inputList: [
                { label: '모임 이름', key: 'title', type: 'text' },
                { label: '인원수', key: 'size', type: 'number' },
                { label: '장소', key: 'place', type: 'combobox', titleKey: 'placeTitle' },
                { label: '모임 시작 시간', key: 'startDatetime', type: 'datetime' },
                { label: '모임 끝 시간', key: 'endDatetime', type: 'datetime' }
            ]
        }
    },
    computed: {
        itemList () {
            return this.$store.getters['meetings/items']
        },
        placeList () {
            return this.$store.getters['places/items']
        },
        user () {
            return this.$auth.user
        }
    },
    methods: {
        async submit ({ title, place, startDatetime, endDatetime, size }) {
            const { lat, lng, placeTitle, placePosition } = place
            const startDate = startDatetime
            const endDate = endDatetime

            const res = await this.$store.dispatch('meetings/post', { title, size, lat, lng, placeTitle, placePosition, startDate, endDate })
            if (res.status === 200) {
                this.$toast.success('추가되었습니다.')
                await this.$store.dispatch('meetings/fetch')
            } else {
                this.$toast.global.error()
            }
        },
        async changeState (id, state) {
            const res = await this.$store.dispatch('meetings/changeState', { id, state })
            if (res.status === 200) {
                this.$toast.success('변경되었습니다.')
            } else {
                this.$toast.global.error()
            }
        },
        convertTimeString (timeString) {
            const time = moment(timeString)
            if (time.get('minute') === 0) {
                return time.format('MM월 DD일 HH시')
            } else {
                return time.format('MM월 DD일 HH시 m분')
            }
        }
    }
}
</script>

<style scoped>

</style>
