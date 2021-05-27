const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-meeting'

async function createTable () {
    const params = {
        TableName,
        KeySchema: [
            { AttributeName: 'itemKey', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'itemKey', AttributeType: 'S' },
            { AttributeName: 'itemState', AttributeType: 'S' }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'itemStateIndex',
                KeySchema: [
                    { AttributeName: 'itemState', KeyType: 'HASH' }
                ],
                Projection: {
                    ProjectionType: 'INCLUDE',
                    NonKeyAttributes: [
                        'userName', 'title', 'size', 'lat', 'lng', 'placeTitle', 'placePosition', 'startDate', 'endDate'
                    ]
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

async function addMeeting ({ userId, userName, title, size, lat, lng, placeTitle, placePosition, startDate, endDate, state }) {
    const itemKey = gen.generateKey()
    const createdAt = gen.generateISOString()
    // const attendeeList = []
    const params = {
        TableName,
        Item: {
            itemKey,
            userId,
            userName,
            size,
            title,
            lat,
            lng,
            placeTitle,
            placePosition,
            startDate,
            endDate,
            createdAt,
            itemState: state
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

async function getMeetingList (targetDate = undefined, amount = 1, unit = 'month') {
    const { startDate, endDate } = gen.generateRangeDate(targetDate, amount, unit)

    const params = {
        TableName,
        FilterExpression: 'startDate BETWEEN :date1 and :date2',
        ExpressionAttributeValues: {
            ':date1': startDate,
            ':date2': endDate
        }
        // ProjectionExpression: ['startDate', 'endDate', 'createdAt', 'itemKey']
    }

    const { Items } = await documentClient.scan(params).promise()
    return Items
}

async function getMeeting (itemKey) {
    const params = {
        TableName,
        Key: {
            itemKey
        }
    }
    const { Item } = await documentClient.get(params).promise()
    return Item
}
//
// async function attend (itemKey, memberInfo) {
//     const params = {
//         TableName,
//         Key: {
//             itemKey
//         },
//         ReturnValues: 'ALL_NEW',
//         UpdateExpression: 'set #attendeeList = list_append(if_not_exists(#attendeeList, :empty_list), :userInfo)',
//         // UpdateExpression: 'set #attendeeList = list_append(if_not_exists(#attendeeList, :empty_list), :userInfo)',
//         ExpressionAttributeNames: {
//             '#attendeeList': 'attendeeList'
//         },
//         ExpressionAttributeValues: {
//             ':userInfo': [memberInfo],
//             ':empty_list': []
//         }
//     }
//
//     return await documentClient.update(params).promise()
// }

async function changeState (itemKey, itemState) {
    const params = {
        TableName,
        Key: {
            itemKey
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'set #itemState = :itemState',
        ExpressionAttributeNames: {
            '#itemState': 'itemState'
        },
        ExpressionAttributeValues: {
            ':itemState': itemState
        }
    }

    return await documentClient.update(params).promise()
}

module.exports = {
    createTable,
    addMeeting,
    getMeetingList,
    getMeeting,
    // attend,
    changeState
}
