const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-attendee'

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
                    { AttributeName: 'userId', KeyType: 'HASH' }
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
                IndexName: 'meetingKeyIndex',
                KeySchema: [
                    { AttributeName: 'meetingKey', KeyType: 'HASH' }
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

async function addItem (meetingKey, userId, userName, profileImage) {
    const itemKey = gen.generateKey()
    const createdAt = gen.generateISOString()
    const params = {
        TableName,
        Item: {
            itemKey,
            meetingKey,
            userId,
            userName,
            profileImage,
            createdAt
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

async function getAttendeeByMeetingKey (meetingKey) {
    const params = {
        TableName,
        IndexName: 'meetingKeyIndex',
        KeyConditionExpression: 'meetingKey = :meetingKey',
        ExpressionAttributeValues: {
            ':meetingKey': meetingKey
        }
    }

    const { Items } = await documentClient.query(params).promise()
    return Items
}

async function getAttendedItemsByUserId (userId) {
    const params = {
        TableName,
        IndexName: 'userIdIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }

    const { Items } = await documentClient.query(params).promise()
    return Items
}

module.exports = {
    createTable,
    addItem,
    deleteItem,
    getAttendeeByMeetingKey,
    getAttendedItemsByUserId
}
