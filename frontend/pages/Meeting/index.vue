<template>
    <v-container style="max-width: 1200px;">
        <v-row justify="space-between">
            <v-col cols="12" md="4">
                <v-card color="main" outlined>
                    <v-card-title class="justify-center white--text">
                        날짜를 선택해주세요
                    </v-card-title>
                    <v-date-picker
                        v-model="date"
                        full-width
                        no-title
                        :events="events"
                        color="main"
                        event-color="purple lighten-1"
                        @change="doUpdateDate"
                        @update:picker-date="doUpdateMeetingList"
                    />
                </v-card>
            </v-col>
            <v-col cols="12" md="8">
                <template v-if="targetMeeting">
                    <v-card class="d-flex flex-column" flat outlined style="height: 100%;">
                        <v-card-title>
                            {{ targetMeeting.title }}
                        </v-card-title>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    날짜
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ targetMeeting.startDate | date }} / {{ targetMeeting.startDate | time }} ~ {{ targetMeeting.endDate | time }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    주소
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ targetMeeting.placePosition }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    모임장
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ targetMeeting.userName }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-card-actions>
                            <v-btn
                                block
                                large
                                rounded
                                :dark="canAttend"
                                :disabled="!canAttend"
                                color="main"
                                @click="doAttend"
                            >
                                참석하기
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
                <template v-else>
                    <v-card flat outlined class="d-flex align-center" style="height: 100%">
                        <v-card-title class="text-center justify-center" style="width: 100%;">
                            해당하는 날짜엔 모임이 없어요 🙄
                        </v-card-title>
                    </v-card>
                </template>
            </v-col>
        </v-row>
        <v-fade-transition>
            <v-row v-if="targetMeeting" justify="space-between">
                <v-col cols="12" md="4">
                    <v-card flat outlined class="pb-4" style="height: 100%">
                        <v-card-title class="justify-center">
                            참가인원
                        </v-card-title>
                        <template v-if="targetMeeting.attendee.length > 0">
                            <v-list-item
                                v-for="(item, index) in targetMeeting.attendee"
                                :key="index"
                                @click="goUserInfo(item)"
                            >
                                <v-list-item-avatar>
                                    <user-avatar
                                        :user="item"
                                    />
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.userName }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                        <template v-else>
                            <v-card-text class="text-center" style="font-size: 1.25em;">
                                아직 없어요 🥺
                            </v-card-text>
                        </template>
                    </v-card>
                </v-col>
                <v-col cols="12" md="8">
                    <v-card flat outlined min-height="400" height="100%">
                        <GmapMap
                            id="map"
                            ref="map"
                            class="map"
                            :center="latlang"
                            :zoom="15"
                            :options="mapOptions"
                            map-type-id="terrain"
                            style="width: 100%; height: 100%"
                        >
                            <GmapMarker :position="latlang" />
                        </GmapMap>
                    </v-card>
                </v-col>
            </v-row>
        </v-fade-transition>
    </v-container>
</template>

<script>
import moment from 'moment'
import UserAvatar from '~/components/moracules/UserAvatar'

export default {
    name: 'Meeting',
    components: { UserAvatar },
    middleware: ['registered'],
    filters: {
        date (value) {
            return moment(value).format('YYYY년 M월 D일')
        },
        time (value) {
            return moment(value).format('HH:mm')
        }
    },
    data () {
        const date = moment().format('YYYY-MM-DD')
        return {
            date,
            meetings: [],
            targetMeeting: null,
            meetingKey: null,
            mapOptions: {
                mapTypeId: 'roadmap',
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
                disableDefaultUI: false
            }
        }
    },
    validate ({ query }) {
        const { date } = query
        if (!date) {
            return true
        }

        return moment(date).isValid()
    },
    computed: {
        events () {
            return this.meetings.map(item => moment(item.startDate).format('YYYY-MM-DD'))
        },
        user () {
            return this.$auth.user
        },
        canAttend () {
            const { targetMeeting, user } = this
            if (!targetMeeting) {
                return false
            }
            return targetMeeting.attendee.every(item => item.userId !== user.userId)
        },
        latlang () {
            const { targetMeeting } = this
            return {
                lat: targetMeeting.lat,
                lng: targetMeeting.lng
            }
        }
    },
    watch: {
        '$route' (to) {
            const { date } = to.query
            if (date) {
                this.date = date
            }
        },
        date (value) {
            this.doUpdateMeetingList(value)
        },
        meetingKey (value) {
            this.doUpdateMeeting(value)
        }
    },
    async mounted () {
        const date = moment().format('YYYY-MM-DD')
        await this.doUpdateDate(date)
        await this.doUpdateMeetingList()
    },
    methods: {
        goUserInfo (user) {
            const { userId } = user
            this.$router.push(`/u/${userId}`)
        },
        doUpdateDate (value) {
            this.$router.push(`/meeting?date=${value}`)
        },
        async doUpdateMeeting (value) {
            if (!value) {
                return
            }

            try {
                const { data } = await this.$axios(`/meetings/${value}`)
                this.targetMeeting = data.result
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }
        },
        async doUpdateMeetingList () {
            const { date } = this
            try {
                const { data } = await this.$axios.get(`/meetings?date=${date}`)
                const meetings = data.result
                this.meetings = meetings
                await this.$nextTick()

                const targetMeeting = meetings.filter(item => moment(item.startDate).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD'))[0] || null

                if (targetMeeting === null) {
                    this.targetMeeting = null
                    this.meetingKey = null
                    return
                }

                const { itemKey } = targetMeeting
                this.meetingKey = itemKey
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }
        },
        async doAttend () {
            const { meetingKey } = this

            try {
                await this.$axios.post('/meetings/attend', { meetingKey })
                this.$toast.success('모임참석 완료 😜')
                await this.doUpdateMeeting(meetingKey)
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
