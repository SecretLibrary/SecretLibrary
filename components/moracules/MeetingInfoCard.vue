<template>
    <v-card :class="floating ? 'floating' : ''" :flat="!floating" @click="$emit('click')">
        <v-card-title>
            {{ title }} 모임
        </v-card-title>
        <v-card-text class="pa-1">
            <v-list two-line flat tile>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            장소
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ placeTitle }}
                        </v-list-item-subtitle>
                        {{ placePosition }}
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            시간
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ startTime }} ~ {{ endTime }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            호스트
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ host }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'MeetingInfoCard',
    props: {
        title: {
            type: String,
            required: true
        },
        placeTitle: {
            type: String,
            required: true
        },
        placePosition: {
            type: String,
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        host: {
            type: String,
            required: true
        },
        floating: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped lang="scss">
    .floating {
        position: absolute;
        left: 36px;
        top: 36px;
        z-index: 1;
    }
</style>
