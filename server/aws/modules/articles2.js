const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-articles-mk2'

async function createTable () {
    const params = {
        TableName,
        KeySchema: [
            { AttributeName: 'itemKey', KeyType: 'HASH' },
            { AttributeName: 'createdAt', KeyType: 'RANGE' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'itemKey', AttributeType: 'S' },
            { AttributeName: 'createdAt', AttributeType: 'S' },
            { AttributeName: 'userId', AttributeType: 'S' },
            { AttributeName: 'meetingKey', AttributeType: 'S' }
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
                    ProjectionType: 'INCLUDE',
                    NonKeyAttributes: ['userInfo', 'book', 'createdAt', 'likey', 'imageUrl', 'articleItems', 'userId', 'meetingKey']
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            },
            {
                IndexName: 'meetingKeyIndex',
                KeySchema: [
                    {
                        AttributeName: 'meetingKey',
                        KeyType: 'HASH'
                    }
                ],
                Projection: {
                    ProjectionType: 'INCLUDE',
                    NonKeyAttributes: ['userInfo', 'book', 'createdAt', 'likey', 'imageUrl', 'articleItems', 'userId', 'meetingKey']
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

async function addItem (userInfo, book, articleItems, userId, meetingKey = null, imageUrl = null, createdAt = null) {
    createdAt = createdAt || gen.generateISOString()
    const itemKey = gen.generateKey(8)
    const commentSize = 0
    const likey = 0

    if (!meetingKey) {
        meetingKey = 'NO-MEETING'
    }

    const params = {
        TableName,
        Item: {
            itemKey,
            createdAt,
            commentSize,
            book,
            userInfo,
            imageUrl,
            articleItems,
            userId,
            meetingKey,
            likey
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
