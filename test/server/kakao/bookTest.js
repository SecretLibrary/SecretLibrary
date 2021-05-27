
const dotenv = require('dotenv')
dotenv.config({ path: '../../../.env' })
console.log(process.env.AWS_SDK_LOAD_CONFIG)

// const axios = require('axios')
// const key = require('./key')
const books = require('../../../server-middleware/aws/modules/books');

// const title = '미움받을 용기';

// (async () => {
//     const res = await books.getItems('미움')
//     console.log(res)
// })()

(async () => {
    const baseURL = 'https://dapi.kakao.com/v3/search/book?target=title'
    const url = encodeURI(`${baseURL}&query=${title}`)

    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `KakaoAK ${key.KAOAO_REST_KEY}`
            }
        })
        const items = res.data.documents.map((item) => {
            const { authors, contents, isbn, publisher, thumbnail, title, translators, url } = item
            return {
                authors,
                contents,
                isbn,
                publisher,
                thumbnail,
                title,
                translators,
                url
            }
        })

        for await (const item of items) {
            await books.addItem(item)
        }
    } catch (e) {
        console.error(e)
    }
})()
