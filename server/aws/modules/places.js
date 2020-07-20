const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-place'

async function createTable () {
    const params = {
        TableName,
        KeySchema: [
            { AttributeName: 'itemKey', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'itemKey', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    }

    try {
        const data = await ddb.createTable(params).promise()
        console.log('Created table. Table description JSON: ', JSON.stringify(data, null, 2))
    } catch (e) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(e, null, 2))
    }
}

async function addPlace (lat, lng, placeTitle, placePosition, tel, size) {
    const itemKey = gen.generateKey()
    const placePhotoList = []
    const params = {
        TableName,
        Item: {
            itemKey,
            tel,
            size,
            lat,
            lng,
            placeTitle,
            placePosition,
            placePhotoList
        }
    }
    try {
        await documentClient.put(params).promise()
        return itemKey
    } catch (e) {
        console.error('Unable to add item to table. Error JSON:', JSON.stringify(e, null, 2))
        throw e
    }
}

async function getPlaceList () {
    const params = {
        TableName
    }
    const { Items } = await documentClient.scan(params).promise()
    return Items
}

module.exports = {
    createTable,
    addPlace,
    getPlaceList
}
