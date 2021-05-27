require('dotenv').config()

module.exports = {
    mode: 'universal',
    target: 'server',
    /*
    ** Headers of the page
    */
    head: {
        // titleTemplate: '%s' + process.env.npm_package_name,
        titleTemplate: '%s' + ' - 비밀서재',
        title: process.env.npm_package_title || '',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || ''
            }
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico'
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Sans+KR:wght@400;700;900&display=swap'
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap'
            }
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: {
        name: 'chasing-dots',
        color: '#e37070',
        background: 'white',
        height: '4px'
    },
    /*
    ** Global CSS
    */
    css: [
        { src: '~assets/styles/main.scss', lang: 'scss' }
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '~plugins/googleMap.js',
        {
            src: '~/plugins/VueInfiniteScroll.js',
            mode: 'client'
        }
    ],
    /*
    ** Nuxt.js dev-routes
    */
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
        '@nuxtjs/eslint-module',
        '@nuxtjs/vuetify',
        '@nuxtjs/pwa',
        '@nuxtjs/dotenv',
        [
            '@nuxtjs/google-analytics', {
                id: 'UA-172419012-1'
            }
        ]
    ],
    dotenv: {
        systemvars: true
    },
    pwa: {
        meta: {
            name: '비밀서재',
            author: 'eggplantiny',
            description: '비밀서재',
            theme_color: 'white',
            lang: 'kr',
            nativeUI: true
        },
        manifest: {
            name: '비밀서재',
            short_name: '비밀서재',
            lang: 'kr',
            theme_color: '#ffffff'
        }
    },
    /*
    ** Nuxt.js routes
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/pwa',
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        '@nuxtjs/toast',
        'nuxt-clipboard2',
        ['vuetify-dialog/nuxt', {
            property: '$dialog',
            actions: [
                { text: '아니요', color: 'gray darken-1', key: false },
                { text: '네', color: 'main', key: true }
            ]
        }],
        ['@nuxtjs/google-adsense', { id: 'ca-pub-7758221888679599' }]
    ],
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
        prefix: '/api',
        proxyHeaders: false,
        credentials: true
    },
    serverMiddleware: [
        { path: '/api', handler: '~/server-middleware/app.js' }
    ],
    /*
    ** Toast Modules
    */
    toast: {
        position: 'top-right',
        duration: 2000,
        register: [
            {
                name: 'error',
                message: '에러가 발생했어요 😨',
                options: {
                    type: 'error'
                }
            }
        ]
    },
    /*
    ** router Module configuration.
    ** See https://ko.nuxtjs.org/api/configuration-router/
    **
    */
    router: {
        middleware: ['auth'],
        linkActiveClass: 'r-active-link',
        linkExactActiveClass: 'r-exact-active-link'
    },
    /*
    ** auth module configuration
    ** https://auth.nuxtjs.org/
    */
    auth: {
        strategies: {
            kakao: {
                _scheme: 'oauth2',
                authorization_endpoint: 'https://kauth.kakao.com/oauth/authorize',
                userinfo_endpoint: 'https://kapi.kakao.com/v2/user/me',
                access_token_endpoint: 'https://kauth.kakao.com/oauth/token',
                scope: ['profile'],
                access_type: 'authorization_code',
                response_type: 'code',
                token_type: 'Bearer',
                redirect_uri: process.env.KAKAO_CALLBACK_URL,
                client_id: process.env.KAKAO_CLIENT_ID,
                token_key: 'access_token',
                state: '11kjwkrajfij2k3nefndsmfnvx23efjjkjsdn'
            }
        }
    },
    /*
    ** vuetify module configuration
    ** https://github.com/nuxt-community/vuetify-module
    */
    vuetify: {
        customVariables: ['~assets/styles/vuetify/main.scss'],
        theme: {
            dark: false,
            themes: {
                light: {
                    main: '#e37070',
                    cancel: '#251f44',
                    alternative: '#ffaaaa',
                    emphasis: '#c7004c',
                    serious: '#8f1537',
                    kakao: '#ffe812',
                    facebook: '#3b5998'
                }
            }
        }
    },
    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        transpile: [/^vue2-google-maps($|\/)/],
        babel: {
            presets ({ isServer }) {
                return [
                    [
                        require.resolve('@nuxt/babel-preset-app'),
                        // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
                        {
                            buildTarget: isServer ? 'server' : 'client',
                            corejs: { version: 3 }
                        }
                    ]
                ]
            }
        },
        extend (config, ctx) {
        }
    },
    env: {
        KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
        GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY
    },
    telemetry: false
}
