const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-question'

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

async function addItem (userId, userName, text, categoryCode) {
    const itemKey = gen.generateKey()
    const createdAt = gen.generateISOString()

    const params = {
        TableName,
        Item: {
            itemKey,
            categoryCode,
            userId,
            userName,
            createdAt,
            text
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

async function updateItem (itemKey, userId, userName, text, categoryCode) {
    const params = {
        TableName,
        Key: {
            itemKey
        },
        UpdateExpression: 'set writerId = :wi, writerName = :wn, question = :q, categoryCode = :cc',
        ExpressionAttributeValues: {
            ':ui': userId,
            ':un': userName,
            ':t': text,
            ':cc': categoryCode
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

async function getList () {
    const params = {
        TableName
    }

    return await documentClient.scan(params).promise()
}

module.exports = {
    createTable,
    addItem,
    updateItem,
    deleteItem,
    getList
}
