<template>
    <v-app-bar app flat color="white">
        <v-container class="d-flex">
            <v-toolbar-title class="title">
                a secret library
            </v-toolbar-title>
            <v-spacer />
            <v-btn text color="main" style="font-weight: bold">
                더 알아보기
            </v-btn>
            <v-btn text color="main" style="font-weight: bold">
                로그인
            </v-btn>
        </v-container>
    </v-app-bar>
</template>

<script>
export default {
    name: 'AppBar'
}
</script>

<style scoped lang="scss">
    .title {
        color: $main !important;
    }
</style>
