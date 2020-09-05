<template>
    <client-only>
        <v-container>
            <v-row>
                <v-col cols="12" md="12" class="py-0">
                    <v-row no-gutters>
                        <template
                            v-for="(article, articleIndex) in library"
                        >
                            <v-col
                                :key="articleIndex"
                                cols="12"
                                sm="12"
                                md="6"
                                xl="4"
                                class="px-2 pb-4"
                            >
                                <postscript-card-v2
                                    :article="article"
                                />
                            </v-col>
                        </template>
                    </v-row>
                </v-col>
                <!-- loader 자리 -->
            </v-row>
        </v-container>
    </client-only>
</template>

<script>
import PostscriptCardV2 from '@/components/moracules/Library/PostscriptCardV2'

export default {
    name: 'Library2',
    components: {
        PostscriptCardV2
    },
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
</style>
