<template>
    <div class="r-label">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'RLabel'
}
</script>

<style scoped lang="scss">
    .r-label {
        color: rgba(32, 32, 32, 0.3);
    }
</style>
