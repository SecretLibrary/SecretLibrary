<template>
    <hover-card>
        <v-card-title>
            질문 리스트
        </v-card-title>
        <template v-if="itemList.length > 0">
            <v-card-text class="pa-0">
                <v-list>
                    <template v-for="(item, index) in itemList">
                        <v-list-item :key="index">
                            <v-list-item-content>
                                <v-list-item-subtitle>
                                    {{ item.categoryCode | categoryName($store) }}
                                </v-list-item-subtitle>
                                <v-list-item-title>
                                    {{ item.text }}
                                </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-menu offset-x min-width="120">
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon v-on="on">
                                            <v-icon>
                                                mdi-dots-vertical
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="deleteItem(item)">
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    삭제
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </v-list>
            </v-card-text>
        </template>
        <template v-else>
            <v-card-text>
                항목 없음
            </v-card-text>
        </template>
        <v-card-actions>
            <v-spacer />
            <input-form-dialog
                title="질문 추가하기"
                :input-list="inputList"
                :items="categoryList"
                @submit="submit"
            />
        </v-card-actions>
    </hover-card>
</template>

<script>
import InputFormDialog from '~/components/moracules/InputFormDialog'
import HoverCard from '~/components/atoms/HoverCard'

export default {
    name: 'AddQuestionCard',
    components: {
        InputFormDialog,
        HoverCard
    },
    filters: {
        categoryName (code, $store) {
            return $store.getters['category/item'](code).Category
        }
    },
    data () {
        return {
            inputList: [
                { label: '질문', key: 'text', type: 'text' },
                { label: '카테고리', key: 'category', type: 'combobox', titleKey: 'Category', valueKey: 'Code', required: false }
            ]
        }
    },
    computed: {
        itemList () {
            return this.$store.getters['questions/items'] || []
        },
        categoryList () {
            return this.$store.getters['category/items'] || []
        },
        user () {
            return this.$auth.user
        }
    },
    async mounted () {
        await this.$store.dispatch('questions/fetch')
    },
    methods: {
        async submit ({ text, category }) {
            let categoryCode

            if (category !== null) {
                categoryCode = category.Code
            }

            const res = await this.$store.dispatch('questions/post', { text, categoryCode })

            if (res.status === 200) {
                this.$toast.success('추가되었습니다.')
                await this.$store.dispatch('questions/fetch')
            } else {
                this.$toast.global.error()
            }
        },
        async deleteItem (item) {
            const itemKey = item.itemKey
            try {
                await this.$store.dispatch('questions/deleteItem', { itemKey })
                this.$toast.success('삭제되었습니다.')
            } catch (e) {
                console.error(e)
                this.$toast.global.error()
            }
        }
    }
}
</script>

<style scoped>

</style>
