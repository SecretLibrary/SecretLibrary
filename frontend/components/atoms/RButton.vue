<template>
    <v-btn
        :color="color"
        outlined
    >
        <slot />
    </v-btn>
</template>

<script>
export default {
    name: 'RButton',
    props: {
        color: {
            type: String,
            default: 'main'
        }
    }
}
</script>

<style scoped>

</style>
