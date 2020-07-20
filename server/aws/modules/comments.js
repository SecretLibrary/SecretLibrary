const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-comments'

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
                    ProjectionType: 'ALL'
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
                    ProjectionType: 'ALL'
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

async function addItem (userId, articleKey, userInfo, comment, imgUrl = null, isSecret = false) {
    const createdAt = gen.generateISOString()
    const itemKey = gen.generateKey(16)

    const params = {
        TableName,
        Item: {
            userId,
            articleKey,
            comment,
            createdAt,
            itemKey,
            userInfo,
            imgUrl,
            isSecret
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

async function getItem (itemKey) {
    const params = {
        TableName,
        Key: {
            itemKey
        }
    }

    const { Item } = await documentClient.get(params).promise()
    return Item
}

async function getItemsByArticleKey (articleKey) {
    const params = {
        TableName,
        IndexName: 'articleKeyIndex',
        KeyConditionExpression: 'articleKey = :v_articleKey',
        ExpressionAttributeValues: {
            ':v_articleKey': articleKey
        },
        ScanIndexForward: false
    }

    const { Items } = await documentClient.query(params).promise()
    return Items
}

async function getItemsByUserId (userId) {
    const params = {
        TableName,
        IndexName: 'userIdIndex',
        KeyConditionExpression: 'userId = :v_userId',
        ExpressionAttributeValues: {
            ':v_userId': userId
        },
        ScanIndexForward: false
    }

    const { Items } = await documentClient.query(params).promise()
    return Items
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

module.exports = {
    createTable,
    addItem,
    getItem,
    getItemsByArticleKey,
    getItemsByUserId,
    deleteItem
}
