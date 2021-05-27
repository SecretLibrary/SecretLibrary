<template>
    <v-hover v-slot:default="{ hover }">
        <v-card
            outlined
            :elevation="hover ? 4 : 1"
        >
            <slot />
        </v-card>
    </v-hover>
</template>

<script>
export default {
    name: 'HoverCard'
}
</script>
