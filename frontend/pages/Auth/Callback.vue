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
    async mounted () {
        await this.$nextTick()
        const user = this.$auth.user

        if (user.registered) {
            return await this.$router.push('/')
        }

        await this.$router.push('/Register')
    }
}
</script>

<style scoped>

</style>
