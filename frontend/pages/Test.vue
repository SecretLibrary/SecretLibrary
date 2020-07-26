<template>
    <v-main>
        <v-card max-width="800" class="ma-auto">
            <v-card-title>
                Test
            </v-card-title>
            <v-card-text>
                <v-file-input @change="onChangeFile" />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn outlined color="main" @click="doUploadImage">
                    UPLOAD
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-main>
</template>

<script>
import { preprocessImage } from '../utils/imageHandler'

export default {
    name: 'Test',
    layout: 'full',
    auth: false,
    data () {
        return {
            file: null
        }
    },
    methods: {
        async onChangeFile (file) {
            if (!file) {
                return
            }
            this.file = await preprocessImage(file)
        },
        async doUploadImage () {
            const { file } = this

            if (!file) {
                return
            }

            await console.log(file)

            const formData = new FormData()
            formData.append('img', file, file.name)
            const res = await this.$axios.post('/images', formData)
            console.log(res)
        }
    }
}
</script>

<style scoped>

</style>
