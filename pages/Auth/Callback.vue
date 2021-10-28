<template>
    <v-container>
        <v-card outlined flat width="480" class="ma-auto">
            <v-card-title class="justify-center">
                잠시만 기다려주세요 🙂
            </v-card-title>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: 'Callback',
    auth: false,
    async mounted () {
        await this.$nextTick()
        // const user = this.$auth.user
        //
        // if (user && user.registered) {
        //     return this.$router.push('/')
        // }
        //
        // return this.$router.push('/Register')
    }
}
</script>

<style scoped>

</style>
