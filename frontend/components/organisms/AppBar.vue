<template>
    <v-app-bar app color="white" :flat="!scrolled">
        <v-container class="d-flex" style="align-items: center;">
            <nuxt-link to="/" style="color: inherit; text-decoration: none;">
                <v-btn text color="main" style="font-weight: bold; font-size: 20px">
                    비밀서재
                </v-btn>
            </nuxt-link>
            <v-spacer />
            <nuxt-link to="/Meeting">
                <v-btn v-show="false" text nuxt color="main" class="btn">
                    모임
                </v-btn>
            </nuxt-link>
            <nuxt-link to="/Library">
                <v-btn text nuxt color="main" class="btn">
                    서재
                </v-btn>
            </nuxt-link>
            <template v-if="loggedIn">
                <nuxt-link to="/Review">
                    <v-btn v-show="false" nuxt text color="main" class="btn">
                        독후감
                    </v-btn>
                </nuxt-link>
                <nuxt-link to="/Article/Write">
                    <v-btn nuxt text color="main" class="btn">
                        글쓰기
                    </v-btn>
                </nuxt-link>
                <v-menu offset-y min-width="150">
                    <template v-slot:activator="{ on }">
                        <v-hover v-slot:default="{ hover }">
                            <v-btn
                                icon
                                :elevation="hover ? 5 :0"
                                :style="hover ? 'transform: scale(1.1);' : ''"
                                v-on="on"
                            >
                                <user-avatar
                                    :user="user"
                                />
                            </v-btn>
                        </v-hover>
                    </template>
                    <v-list dense flat tile>
                        <v-list-item
                            @click="goMyItems"
                        >
                            내 서재
                        </v-list-item>
                        <v-list-item
                            @click="$router.push('/setting')"
                        >
                            설정
                        </v-list-item>
                        <v-list-item v-if="isManager" @click="goManager">
                            🧐 운영진
                        </v-list-item>
                        <v-list-item color="main" @click="onClickLogout">
                            로그아웃
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <template v-else>
                <v-btn nuxt text color="main" class="btn" @click="onClickLogin">
                    <nuxt-link to="/Login">
                        로그인
                    </nuxt-link>
                </v-btn>
            </template>
        </v-container>
    </v-app-bar>
</template>

<script>

import UserAvatar from '~/components/moracules/UserAvatar'
export default {
    name: 'AppBar',
    components: { UserAvatar },
    data () {
        return {
            myMenu: false
        }
    },
    computed: {
        loggedIn () {
            return this.$store.state.auth.loggedIn && this.user.registered === true
        },
        user () {
            return this.$store.state.auth.user
        },
        isManager () {
            return this.user.cLevel > 1
        },
        scrolled () {
            return this.$store.getters['app/scrolled']
        }
    },
    methods: {
        onClickLogin () {
            this.$router.push('/Login')
        },
        async onClickLogout () {
            try {
                const res = await this.$auth.ctx.$axios.post('/auth/logout')
                if (res.status !== 200) {
                    this.$toast.global.error()
                } else {
                    this.$toast.info('로그아웃에 성공했습니다.')
                    await this.$auth.logout()
                }
            } finally {
            }
        },
        onClickMeeting () {
            this.$router.push('/Meeting/Map')
        },
        onClickWrite () {
            this.$router.push('/Write_UNUSED/Test')
        },
        onClickLibrary () {
            this.$router.push('/Library')
        },
        onClickTitle () {
            if (this.$router.currentRoute.fullPath !== '/') {
                this.$router.push('/')
            }
        },
        goManager () {
            this.$router.push('/Admin/')
        },
        goMyItems () {
            const { user } = this
            this.$router.push(`/user/${user.userId}`)
        }
    }
}
</script>

<style scoped lang="scss">
    .title {
        color: $main !important;
        font-weight: bolder !important;
    }

    .btn {
        font-weight: bold;
        margin-right: 4px;
    }

</style>
