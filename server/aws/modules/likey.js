const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-likey'

async function createTable () {
    const params = {
        TableName,
        KeySchema: [
            { AttributeName: 'itemKey', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'itemKey', AttributeType: 'S' },
            { AttributeName: 'articleKey', AttributeType: 'S' },
            { AttributeName: 'userId', AttributeType: 'S' }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'userIdIndex',
                KeySchema: [
                    {
                        AttributeName: 'userId',
                        KeyType: 'HASH'
                    }
                ],
                Projection: {
                    ProjectionType: 'KEYS_ONLY'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            },
            {
                IndexName: 'articleKeyIndex',
                KeySchema: [
                    {
                        AttributeName: 'articleKey',
                        KeyType: 'HASH'
                    }
                ],
                Projection: {
                    ProjectionType: 'KEYS_ONLY'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            }
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

async function addItem (userId, articleKey, point) {
    const createdAt = gen.generateISOString()
    const itemKey = gen.generateKey(8)

    const params = {
        TableName,
        Item: {
            userId,
            articleKey,
            point,
            createdAt,
            itemKey
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

module.exports = {
    createTable,
    addItem
}