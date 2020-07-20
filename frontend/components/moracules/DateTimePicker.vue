<template>
    <v-dialog v-model="dialogModel" max-width="500">
        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="viewString"
                :label="label"
                :rules="rules"
                append-icon="mdi-calendar"
                readonly
                v-on="on"
            />
        </template>
        <hover-card>
            <v-stepper v-model="stepperModel" style="box-shadow: none;">
                <v-stepper-items>
                    <v-stepper-content class="pa-0" :step="1">
                        <v-date-picker v-model="date" full-width />
                    </v-stepper-content>
                    <v-stepper-content :step="2">
                        <v-time-picker v-model="time" full-width :allowed-minutes="allowedMinutes" />
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </hover-card>
    </v-dialog>
</template>

<script>
import moment from 'moment'
import HoverCard from '~/components/atoms/HoverCard'

export default {
    name: 'DateTimePicker',
    components: { HoverCard },
    props: {
        label: {
            type: String,
            default: ''
        },
        rules: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            stepperModel: 1,
            dialogModel: false,
            date: null,
            time: null,
            dateTime: null
        }
    },
    computed: {
        viewString () {
            if (this.dateTime === null) {
                return null
            } else {
                return this.dateTime.format('YYYY-MM-DD HH:mm')
            }
        }
    },
    watch: {
        dialogModel (value) {
            if (value === true) {
                this.stepperModel = 1
                this.date = null
                this.time = null
                this.dateTime = null
            }
        },
        date (after, before) {
            if (after === null) {
                return
            }
            if (after !== before) {
                this.stepperModel += 1
            }
        },
        time (after, before) {
            if (after === null) {
                return
            }
            if (after !== before) {
                this.dialogModel = false
                const date = this.date
                const time = this.time
                const dateTime = moment(`${date} ${time}`)
                this.dateTime = dateTime
                this.$emit('input', dateTime)
            }
        }
    },
    methods: {
        allowedMinutes: v => v % 5 === 0
    }
}
</script>

<style scoped>

</style>
