const gen = require('../../utils/gen')
const { documentClient, ddb } = require('../sdk')

const TableName = 'reading-party-user'

async function createTable () {
    const params = {
        TableName,
        KeySchema: [
            { AttributeName: 'itemKey', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'itemKey', AttributeType: 'S' },
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
                    ProjectionType: 'INCLUDE',
                    NonKeyAttributes: ['userName', 'gender', 'email', 'profileImage', 'createdAt', 'introduction']
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

async function addItem (itemKey, email, gender, userName, profileImage, userId, provider, introduction = '') {
    const experience = 10
    const cLevel = 0
    const level = 1
    const registered = false
    const createdAt = gen.generateISOString()

    //  Key 는 소셜 로그인에서 받아온 id 값
    //  id 는 회원가입시 회원이 입력한 id 값
    //  key, name, userId, gender, email, profileImage, experience, cLevel, level, createdAt

    const params = {
        TableName,
        Item: {
            itemKey,
            userName,
            userId,
            gender,
            email,
            profileImage,
            experience,
            cLevel,
            level,
            registered,
            createdAt,
            provider,
            introduction
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

async function updateProfile (itemKey, userName, introduce, profileImage) {
    const params = {
        TableName,
        Key: {
            itemKey
        },
        UpdateExpression: 'set userName = :userName, introduce = :introduce, profileImage = :profileImage',
        ExpressionAttributeValues: {
            ':userName': userName,
            ':introduce': introduce,
            ':profileImage': profileImage
        }
    }

    try {
        await documentClient.update(params).promise()
        return itemKey
    } catch (e) {
        console.error('Unable to add item to table. Error JSON:', JSON.stringify(e, null, 2))
        throw e
    }
}

async function putItem (itemKey, email, gender, userName, profileImage, userId, registered, introduction = '') {
    const params = {
        TableName,
        Key: {
            itemKey
        },
        UpdateExpression: 'set #email = :email, #gender = :gender, #userName = :userName, #profileImage = :profileImage, #userId = :userId, #registered = :registered, #introduction = :introduction',
        ExpressionAttributeNames: {
            '#email': 'email',
            '#gender': 'gender',
            '#userName': 'userName',
            '#profileImage': 'profileImage',
            '#userId': 'userId',
            '#registered': 'registered',
            '#introduction': 'introduction'
        },
        ExpressionAttributeValues: {
            ':email': email,
            ':gender': gender,
            ':userName': userName,
            ':profileImage': profileImage,
            ':userId': userId,
            ':registered': registered,
            ':introduction': introduction
        }
    }

    try {
        await documentClient.update(params).promise()
        return itemKey
    } catch (e) {
        console.error('Unable to add item to table. Error JSON:', JSON.stringify(e, null, 2))
        throw e
    }
}

/*
{
    "TableName": "GameScores",
    "IndexName": "GameTitleIndex",
    "KeyConditionExpression": "GameTitle = :v_title",
    "ExpressionAttributeValues": {
        ":v_title": {"S": "Meteor Blasters"}
    },
    "ProjectionExpression": "UserId, TopScore",
    "ScanIndexForward": false
}
*/

async function getUserById (userId) {
    const params = {
        TableName,
        IndexName: 'userIdIndex',
        KeyConditionExpression: 'userId = :v_userId',
        ExpressionAttributeValues: {
            ':v_userId': userId
        },
        ProjectionExpression: 'userName, gender, email, profileImage, createdAt, userId, introduction',
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
        }
    }
    const { Item } = await documentClient.get(params).promise()
    return Item
}

async function getItemList () {
    const params = {
        TableName
        // ProjectionExpression: '#id, #l, cLevel, username, email, profileImage',
        // ExpressionAttributeNames: { '#id': 'id', '#l': 'level' }
    }

    const { Items } = await documentClient.scan(params).promise()
    return Items
}

module.exports = {
    createTable,
    addItem,
    getItem,
    getItemList,
    getUserById,
    updateProfile,
    putItem
}
