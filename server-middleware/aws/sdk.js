const AWS = require('aws-sdk')

const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' })
AWS.config.update({ region: 'ap-northeast-2' })
AWS.config.credentials = credentials

const s3 = new AWS.S3()
const ddb = new AWS.DynamoDB()
const documentClient = new AWS.DynamoDB.DocumentClient()

module.exports = {
    s3, ddb, documentClient
}
