<template>
    <div>
        <v-img width="100%" height="600" src="https://images.unsplash.com/photo-1553729784-e91953dec042?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80">
            <div class="banner-inner">
                <p>감성과 지성을</p>
                <p>교류하고 소통하고자 합니다.</p>
            </div>
        </v-img>
        <v-container>
            <v-btn color="main" dark text>
                Hello World
            </v-btn>
        </v-container>
    </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
    .banner-inner {
        position: absolute;
        bottom: 15%;
        left: 10%;
        color: white;
        font-size: 40px;
        font-family: 'Nanum Myeongjo', serif;
    }
</style>
