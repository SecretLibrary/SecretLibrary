<template>
    <div class="map-wrap">
        <template v-if="hasItem">
            <template v-if="$vuetify.breakpoint.smAndDown">
                <meeting-info-card
                    :title="title"
                    :place-title="placeTitle"
                    :place-position="placePosition"
                    :start-time="startTime"
                    :end-time="endTime"
                    :host="host"
                    @click="setCenter"
                />
            </template>
            <template v-else>
                <meeting-info-card
                    :floating="true"
                    :title="title"
                    :place-title="placeTitle"
                    :place-position="placePosition"
                    :start-time="startTime"
                    :end-time="endTime"
                    :host="host"
                    @click="setCenter"
                />
            </template>
            <GmapMap
                id="map"
                ref="map"
                class="map"
                :center="latlang"
                :zoom="15"
                :options="options"
                map-type-id="terrain"
                style="width: 100%; height: 100%"
            >
                <GmapMarker :position="latlang" />
            </GmapMap>
        </template>
    </div>
</template>

<script>
import moment from 'moment'
import MeetingInfoCard from '~/components/moracules/MeetingInfoCard'
export default {
    name: 'MeetingMap',
    components: { MeetingInfoCard },
    auth: false,
    async asyncData ({ $axios, error }) {
        const res = await $axios.get('/meetings?state=OPEN')
        if (res.status !== 200) {
            error(res.status)
        }

        const items = res.data.result
        const hasItem = items.length > 0

        if (hasItem !== true) {
            return {
                hasItem
            }
        }

        const item = items[0]
        const date = moment(item.startDate).format('YYYY년 MM월 DD일')
        const startTime = moment(item.startDate).format('HH:mm')
        const endTime = moment(item.endDate).format('HH:mm')
        const latlang = { lat: item.lat, lng: item.lng }
        const placeTitle = item.placeTitle
        const placePosition = item.placePosition
        const host = item.userName
        const title = item.title

        return {
            date,
            title,
            startTime,
            endTime,
            latlang,
            placeTitle,
            placePosition,
            host,
            hasItem
        }
    },
    data () {
        return {
            options: {
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
    methods: {
        async getMap () {
            return await this.$refs.map.$mapPromise
        },
        async setCenter () {
            const map = await this.getMap()
            map.panTo(this.latlang)
            map.setZoom(18)
            this.$vuetify.goTo('#map')
        }
    },
    head () {
        return {
            title: '모임'
        }
    }
}
</script>

<style scoped lang="scss">
    .map-wrap {
        width: 100%;
        height: 100%;
    }

    .map {
        width: 100vw;
        height: 100vh;
        z-index: 0;
    }
</style>
