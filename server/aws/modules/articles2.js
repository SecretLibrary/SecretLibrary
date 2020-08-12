const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-articles-2'

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
    const dateKey = gen.generateDateKey(createdAt)
    const commentSize = 0
    const likey = 0

    if (!meetingKey) {
        meetingKey = 'NO-MEETING'
    }

    const params = {
        TableName,
        Item: {
            itemKey,
            dateKey,
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

async function getItems (itemKey = null, Limit = 5) {
    const params = {
        TableName,
        Limit
    }

    if (itemKey) {
        params.ExclusiveStartKey = {
            itemKey
        }
    }

    return await documentClient.scan(params).promise()
}

async function getItemsByUserId (userId, LastEvaluatedKey = null, Limit = 20) {
    const params = {
        TableName,
        LastEvaluatedKey,
        Limit,
        IndexName: 'userIdIndex',
        KeyConditionExpression: 'userId = :v_userId',
        ExpressionAttributeValues: {
            ':v_userId': userId
        },
        ProjectionExpression: 'userInfo, itemKey, book, createdAt, likey, imageUrl, articleItems, userId, meetingKey',
        ScanIndexForward: false
    }

    const { Items } = await documentClient.query(params).promise()
    return Items
}

async function getItem (itemKey) {
    const params = {
        TableName,
        Key: {
            itemKey
        },
        ProjectionExpression: 'userInfo, itemKey, book, createdAt, likey, imageUrl, articleItems, userId, meetingKey'
    }

    const { Item } = await documentClient.get(params).promise()
    return Item
}

async function updateItem (itemKey, userInfo, articleItems, imageUrl, book, meetingKey, userId) {
    const params = {
        TableName,
        Key: {
            itemKey
        },
        UpdateExpression: 'set userInfo = :user, userId = :userId, articleItems = :articleItems, imageUrl = :imageUrl, book = :book, meetingKey = :meetingKey',
        ExpressionAttributeValues: {
            ':userId': userId,
            ':user': userInfo,
            ':articleItems': articleItems,
            ':imageUrl': imageUrl,
            ':book': book,
            ':meetingKey': meetingKey
        },
        ReturnValues: 'UPDATED_NEW'
    }

    return await documentClient.update(params).promise()
}

async function updateDateKey (itemKey, createdAt) {
    const dateKey = gen.generateDateKey(createdAt)
    const params = {
        TableName,
        Key: {
            itemKey
        },
        UpdateExpression: 'set dateKey = :dateKey',
        ExpressionAttributeValues: {
            ':dateKey': dateKey
        },
        ReturnValues: 'UPDATED_NEW'
    }

    return await documentClient.update(params).promise()
}

async function deleteItem (itemKey) {
    const params = {
        TableName,
        Key: {
            itemKey
        },
        ConditionExpression: 'attribute_exists(itemKey)'
    }
    return await documentClient.delete(params).promise()
}

async function updateLikey (itemKey, likey) {
    const params = {
        TableName,
        Key: {
            itemKey
        },
        UpdateExpression: 'set likey = :likey',
        ExpressionAttributeValues: {
            ':likey': likey,
        },
        ReturnValues: 'UPDATED_NEW'
    }
    return await documentClient.update(params).promise()
}

module.exports = {
    createTable,
    getItems,
    getItemsByUserId,
    getItem,
    addItem,
    deleteItem,
    updateItem,
    updateLikey,
    updateDateKey
}
