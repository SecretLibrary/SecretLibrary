const dotenv = require('dotenv')
dotenv.config({ path: '../../../.env' })
const tables = require('../../../server-middleware/aws/modules').tables

async function immigrateTable (srcTable, destTable) {
    let res = await srcTable.getItems(null, 100)

    //  userInfo, book, questions, userId, meetingKey, imageUrl, createdAt, itemKey, comments, likey
    const promises = res.Items.map(({
        userInfo,
        book,
        articleItems,
        userId,
        meetingKey,
        imageUrl,
        createdAt,
        itemKey
    }) => {
        const questions = articleItems.map(item => item.question)
        destTable.addItem(userInfo, book, questions, userId, meetingKey, imageUrl, itemKey, createdAt)
    })

    res = await Promise.all(promises)
    console.log(res)
}

(async () => {
    await immigrateTable(tables.articles, tables.library)
    // const { Items } = await tables.articles2.getItems(null, 30)
    // Items.forEach(({ createdAt, itemKey }) => {
    //     console.log(createdAt, itemKey)
    // })
})()
