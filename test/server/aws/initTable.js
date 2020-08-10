const dotenv = require('dotenv')
dotenv.config({ path: '../../../.env' })
const tables = require('../../../server/aws/modules').tables;

(async () => {
    // const asd = await imageHandler.uploadImageViaURL('https://upload.wikimedia.org/wikipedia/commons/c/ce/Joy_at_ICN_Airport_on_January_10%2C_2020.png', '둥둥이')
    // console.log(asd)
    // await questions.createTable()
    for await (const key of Object.keys(tables)) {
        const target = tables[key]
        console.log(`start to create table [${key}]`)
        try {
            await target.createTable()
        } catch (e) {
            console.error(`failed to create table [${key}] cause by ${e.message}`)
        }
    }
})()
