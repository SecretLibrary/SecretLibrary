<template>
    <client-only>
        <v-container style="max-width: 1164px">
            <v-row>
                <template v-for="(article, index) in library">
                    <v-col
                        :key="index"
                        cols="12"
                        sm="12"
                        md="6"
                    >
                        <v-card
                            outlined
                            elevation="0"
                        >
                            <v-row dense>
                                <v-col cols="3">
                                    <v-img
                                        :src="article.book.thumbnail"
                                        aspect-ratio="0.66"
                                        max-width="140"
                                        width="100%"
                                        class="book-border ml-1"
                                    />
                                </v-col>
                                <v-col cols="9">
                                    <v-card-title class="border justify-center py-1 px-0">
                                        {{ article.book.title }}
                                    </v-card-title>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </template>
            </v-row>
        </v-container>
    </client-only>
</template>

<script>
export default {
    name: 'Library2',
    computed: {
        library () {
            return this.$store.getters['library/items']
        }
    },
    async beforeMount () {
        await this.$store.dispatch('library/init')
        await this.$store.dispatch('library/fetch')
    }
}
</script>

<style scoped lang="scss">
.book-border {
    border: #7F828B solid 2px;
    border-radius: 4px;
    transition: border 0.5s;
}
</style>
