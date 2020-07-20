<template>
    <v-main>
        <v-card max-width="800" class="ma-auto">
            <v-card-title>
                Test
            </v-card-title>
            <v-card-actions>
                <v-spacer />
                <v-btn rounded color="main" dark @click="doTest">
                    Hello
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-main>
</template>

<script>
export default {
    name: 'Test',
    layout: 'full',
    auth: false,
    methods: {
        doTest () {
            this.$toast.global.warning()
        }
    }
}
</script>

<style scoped>

</style>
