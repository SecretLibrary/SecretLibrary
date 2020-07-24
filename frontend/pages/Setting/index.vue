<template>
    <v-container style="max-width: 800px;">
        <v-card flat elevation="0">
            <v-card-title class="font-weight-bold">
                아이디
            </v-card-title>
            <v-card-subtitle class="text-h4">
                {{ user.userId }}
            </v-card-subtitle>
            <v-card-title class="font-weight-bold">
                이름
            </v-card-title>
            <v-card-subtitle class="text-h4">
                {{ user.userName }}
            </v-card-subtitle>
            <v-card-title class="font-weight-bold">
                소개
            </v-card-title>
            <v-card-subtitle class="text-h4">
                {{ user.introduction }}
            </v-card-subtitle>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: 'Setting',
    middleware: ['registered'],
    computed: {
        user () {
            return this.$auth.user
        }
    }
}
</script>

<style scoped>

</style>
