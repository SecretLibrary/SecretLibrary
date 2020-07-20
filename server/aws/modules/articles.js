const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-articles'

async function createTable () {
    const params = {
        TableName,
        KeySchema: [
            { AttributeName: 'itemKey', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'itemKey', AttributeType: 'S' },
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
                    NonKeyAttributes: ['author', 'book', 'createdAt', 'favorites', 'imageUrl', 'articleItems']
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
                    NonKeyAttributes: ['author', 'book', 'createdAt', 'favorites', 'imageUrl', 'articleItems']
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

async function addItem (author, book, articleItems, userId, meetingKey = null, imageUrl = null) {
    const createdAt = gen.generateISOString()
    const itemKey = gen.generateKey(8)
    const commentSize = 0
    const likeySize = 0

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
            author,
            imageUrl,
            articleItems,
            userId,
            meetingKey,
            likeySize
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

async function getItems (userId = null) {
    if (userId) {
        const params = {
            TableName,
            IndexName: 'userIdIndex',
            KeyConditionExpression: 'userId = :v_userId',
            ExpressionAttributeValues: {
                ':v_userId': userId
            },
            ProjectionExpression: 'author, itemKey, book, createdAt, favorites, imageUrl, articleItems',
            ScanIndexForward: false
        }

        const { Items } = await documentClient.query(params).promise()
        return Items
    }

    const params = {
        TableName
    }
    const { Items } = await documentClient.scan(params).promise()
    return Items
}

async function getItem (itemKey) {
    const params = {
        TableName,
        Key: {
            itemKey
        },
        ProjectionExpression: 'author, itemKey, book, createdAt, favorites, imageUrl, articleItems'
    }

    const { Item } = await documentClient.get(params).promise()
    return Item
}

async function updateItem (itemKey, user, items, url, book, meetingKey, userId) {
    const params = {
        TableName,
        Key: {
            itemKey
        },
        UpdateExpression: 'set author = :user, userId = :userId, items = :items, url = :url, book = :book, meetingKey = :meetingKey',
        ExpressionAttributeValues: {
            ':userId': userId,
            ':user': user,
            ':items': items,
            ':url': url,
            ':book': book,
            ':meetingKey': meetingKey
        },
        ReturnValues: 'UPDATED_NEW'
    }

    return await documentClient.update(params).promise()
}

module.exports = {
    createTable,
    getItems,
    getItem,
    addItem,
    updateItem
}
