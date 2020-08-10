const dotenv = require('dotenv')
dotenv.config({ path: '../../../.env' })
const tables = require('../../../server/aws/modules').tables

async function immigrateTable (srcTable, destTable) {
    let res = await srcTable.getItems(null, 100)
    console.log(res)

    const promises = res.Items.map(({
        userInfo,
        book,
        articleItems,
        userId,
        meetingKey,
        imageUrl,
        createdAt
    }) => destTable.addItem(userInfo, book, articleItems, userId, meetingKey, imageUrl, createdAt))

    res = await Promise.all(promises)
    console.log(res)
}

(async () => {
    const { Items } = await tables.articles2.getItems(null, 30)
    // await immigrateTable(tables.articles, tables.articles2)
    Items.forEach(({ createdAt, itemKey }) => {
        console.log(createdAt, itemKey)
    })
})()
