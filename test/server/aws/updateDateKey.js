const dotenv = require('dotenv')
dotenv.config({ path: '../../../.env' })
const tables = require('../../../server/aws/modules').tables;

(async () => {
    let res = await tables.articles.getItems(null, 100)

    const promises = res.Items.map(({ itemKey, createdAt }) => tables.articles.updateDateKey(itemKey, createdAt))
    res = await Promise.all(promises)
    console.log(res)
})()
