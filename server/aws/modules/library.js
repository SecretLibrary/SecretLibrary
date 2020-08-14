const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-library'

async function createTable () {
    const params = {
        TableName,
        KeySchema: [
            { AttributeName: 'itemKey', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'itemKey', AttributeType: 'S' },
            { AttributeName: 'userId', AttributeType: 'S' },
            { AttributeName: 'meetingKey', AttributeType: 'S' },
            { AttributeName: 'dateKey', AttributeType: 'S' }
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
                    NonKeyAttributes: ['userInfo', 'book', 'createdAt', 'likey', 'imageUrl', 'questions', 'userId', 'meetingKey', 'comments']
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
                    NonKeyAttributes: ['userInfo', 'book', 'createdAt', 'likey', 'imageUrl', 'questions', 'userId', 'meetingKey', 'comments']
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            },
            {
                IndexName: 'dateKeyIndex',
                KeySchema: [
                    {
                        AttributeName: 'dateKey',
                        KeyType: 'HASH'
                    }
                ],
                Projection: {
                    ProjectionType: 'INCLUDE',
                    NonKeyAttributes: ['userInfo', 'book', 'createdAt', 'likey', 'imageUrl', 'questions', 'userId', 'meetingKey', 'comments']
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

export default {
    createTable
}
