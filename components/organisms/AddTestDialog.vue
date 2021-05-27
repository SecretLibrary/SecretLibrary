<template>
    <input-form-dialog title="test" :input-list="items" @submit="submit" />
</template>

<script>
import InputFormDialog from '~/components/moracules/InputFormDialog'

export default {
    name: 'AddTestDialog',
    components: { InputFormDialog },
    data () {
        return {
            items: [
                { label: 'Hello', key: 'hello', type: 'text', required: true },
                { label: 'World', key: 'world', model: null, type: 'text', required: true }
            ]
        }
    },
    methods: {
        submit (items) {
        }
    }
}
</script>

<style scoped>

</style>
