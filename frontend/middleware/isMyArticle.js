
export default async function ({ params, $axios, $auth, error }) {
    const { articleKey } = params
    const user = $auth.user

    try {
        const { data } = await $axios.get(`/articles/${articleKey}`)
        const article = data.result

        if (!article) {
            return error({ statusCode: 404 })
        }

        if (article.author.userId !== user.userId) {
            return error({ statusCode: 403 })
        }
    } catch (e) {
        error(e)
    }
}
