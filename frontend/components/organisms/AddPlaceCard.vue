<template>
    <hover-card>
        <v-card-title>
            장소
        </v-card-title>
        <template v-if="itemList.length > 0">
            <v-card-text class="pa-0">
                <v-list>
                    <template v-for="(item, index) in itemList">
                        <v-list-item :key="index">
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ item.placeTitle }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ item.placePosition }}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    {{ item.tel }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
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
            <input-form-dialog title="장소 추가하기" :input-list="inputList" @submit="submit" />
        </v-card-actions>
    </hover-card>
</template>

<script>

import InputFormDialog from '~/components/moracules/InputFormDialog'
import HoverCard from '~/components/atoms/HoverCard'
export default {
    name: 'AddPlaceCard',
    components: { HoverCard, InputFormDialog },
    data () {
        return {
            inputList: [
                { label: '장소 이름', key: 'placeTitle', type: 'text', required: true },
                { label: '주소', key: 'placePosition', type: 'text', required: true },
                { label: '위도', key: 'lat', type: 'number', required: true },
                { label: '경도', key: 'lng', type: 'number', required: true },
                { label: '전화번호', key: 'tel', type: 'tel', required: true }
            ]
        }
    },
    computed: {
        itemList () {
            return this.$store.getters['places/items'] || []
        }
    },
    async mounted () {
        await this.$store.dispatch('places/fetch')
    },
    methods: {
        async submit ({ placeTitle, placePosition, lat, lng, tel }) {
            const res = await this.$store.dispatch('places/post', { placeTitle, placePosition, lat, lng, tel })
            if (res.status === 200) {
                this.$toast.success('추가되었습니다.')
                await this.$store.dispatch('places/fetch')
            } else {
                this.$toast.global.error()
            }
        }
    }
}
</script>

<style scoped>

</style>
