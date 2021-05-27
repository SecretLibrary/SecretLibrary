<template>
    <v-dialog v-model="dialogModel" max-width="500">
        <template v-slot:activator="{ on }">
            <v-btn text color="primary" v-on="on">
                {{ title }}
            </v-btn>
        </template>
        <hover-card>
            <v-card-title>
                {{ title }}
            </v-card-title>
            <v-card-text class="pa-2">
                <v-form ref="form">
                    <v-list dense>
                        <template v-for="(item, index) in inputList">
                            <v-list-item :key="index">
                                <date-time-picker v-if="item.type === 'datetime'" v-model="models[item.key]" :label="item.label" :rules="rules.required" />
                                <v-combobox
                                    v-else-if="item.type === 'combobox'"
                                    v-model="models[item.key]"
                                    :label="item.label"
                                    :items="items"
                                    :rules="item.required ? rules.required : []"
                                    :item-text="item.titleKey"
                                />
                                <v-text-field v-else v-model="models[item.key]" :label="item.label" :type="item.type" :rules="rules.required" />
                            </v-list-item>
                        </template>
                    </v-list>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text color="error" @click="reset">
                    초기화
                </v-btn>
                <v-btn v-if="hasAdd" text color="green lighten-1" @click="add">
                    추가하기
                </v-btn>
                <v-btn text color="primary" @click="submit">
                    제출
                </v-btn>
            </v-card-actions>
        </hover-card>
    </v-dialog>
</template>

<script>
import HoverCard from '~/components/atoms/HoverCard'
import DateTimePicker from '~/components/moracules/DateTimePicker'

export default {
    name: 'InputFormDialog',
    components: {
        DateTimePicker,
        HoverCard
    },
    props: {
        title: {
            type: String,
            required: true
        },
        inputList: {
            type: Array,
            default: () => []
        },
        items: {
            type: Array,
            default: () => []
        },
        hasAdd: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            rules: {
                required: [
                    v => !!v || '항목을 입력 해 주세요.'
                ]
            },
            dialogModel: false,
            models: { }
        }
    },
    watch: {
        async dialogModel (value) {
            if (value === true) {
                await this.$nextTick()
                await this.reset()
            }
        }
    },
    mounted () {
        this.inputList.forEach((item) => {
            const key = item.key
            this.$set(this.models, key, null)
        })
    },
    methods: {
        submit () {
            const valid = this.$refs.form.validate()
            if (!valid) {
                this.$toast.global.error()
                return
            }
            const items = Object.keys(this.models).reduce((prev, key) => {
                prev[key] = JSON.parse(JSON.stringify(this.models[key]))
                return prev
            }, {})
            this.$emit('submit', items)
            this.dialogModel = false
        },
        reset () {
            this.removeAllData()
            this.$refs.form.resetValidation()
        },
        removeAllData () {
            const keys = Object.keys(this.models)
            keys.forEach((key) => {
                this.$set(this.models, key, null)
            })
        },
        add () {
            this.$emit('add')
        }
    }
}
</script>

<style scoped>

</style>
