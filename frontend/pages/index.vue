<template>
    <div>
        <v-img width="100%" height="600" :src="bannerImage">
            <div class="banner-inner">
                <p>감성과 지성을</p>
                <p>교류하고 소통하고자 합니다.</p>
            </div>
        </v-img>
        <v-container>
            <div class="info-inner pa-8 text-center">
                <p>
                    비밀서재는 <span>{{ startString }}</span>부터 <span>{{ dayCount }}</span>일 동안
                </p>
                <p>
                    <span>250명</span>의 회원님들과
                </p>
                <p>
                    <span>123번</span>의 모임에서
                </p>
                <p>
                    <span>1023권</span>의 책을 읽고
                </p>
                <p>
                    <span>246시간</span> 동안 서로의 생각을 나누었습니다.
                </p>
            </div>
        </v-container>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: 'Root',
    auth: false,
    asyncData () {
        const startMoment = moment('2017-07-12')
        const endMoment = moment()

        const startString = startMoment.format('YYYY년 M월 D일')
        const endString = endMoment.format('YYYY년 MM월 D일')
        const dayCount = endMoment.diff(startMoment, 'day')
        const bannerImage = 'https://images.unsplash.com/photo-1553729784-e91953dec042?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'

        return {
            startString,
            endString,
            dayCount,
            bannerImage
        }
    },
    computed: {

    },
    head () {
        return {
            title: '홈'
        }
    }
}
</script>

<style scoped lang="scss">
    .banner-inner {
        position: absolute;
        bottom: 15%;
        left: 10%;
        color: white;
        font-size: 40px;
        font-weight: bolder;
    }

    .info-inner {
        p {
            font-size: 30px;
            font-weight: bold;
            color: $article;

            span {
                color: $main;
            }
        }
    }
</style>
