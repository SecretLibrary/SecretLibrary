
const axios = require('axios')

const KAOAO_REST_KEY = process.env.KAKAO_REST_KEY

async function queryBooks (query) {
    const baseURL = 'https://dapi.kakao.com/v3/search/book?target=title'
    const url = encodeURI(`${baseURL}&query=${query}`)

    const res = await axios.get(url, {
        headers: {
            Authorization: `KakaoAK ${KAOAO_REST_KEY}`
        }
    })

    //  authors, contents, isbn, publisher, thumbnail, title, translators, url
    return res.data.documents || []
}

module.exports = queryBooks
