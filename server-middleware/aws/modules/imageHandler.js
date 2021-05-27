
const jimp = require('jimp')
const multer = require('multer')
const multerS3 = require('multer-s3')
// const path = require('path')
const uuid = require('uuid/v4')
const { s3 } = require('../sdk')

const bucket = 'reading.party.images'
const region = s3.config.region

const downloadableUrl = fileName => `https://s3.${region}.amazonaws.com/${bucket}/${fileName}`

async function downloadImage (url) {
    const jimpObject = await jimp.read({
        url,
        headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    const hash = jimpObject.hash()
    const mime = jimpObject.getMIME()
    const extension = jimpObject.getExtension()
    const buffer = await jimpObject.getBufferAsync(mime)
    const base64 = await jimpObject.getBase64Async(mime)

    return {
        hash, mime, buffer, base64, extension
    }
}

async function uploadImageViaURL (url, title) {
    const jimpObject = await jimp.read({ url })

    const hash = jimpObject.hash()
    const mime = jimpObject.getMIME()
    const extension = jimpObject.getExtension()
    const buffer = await jimpObject.getBufferAsync(mime)

    const params = {
        Bucket: bucket,
        Key: `profileImages/${title}.${extension}`,
        ACL: 'public-read',
        Body: buffer,
        ContentType: mime
    }

    try {
        const data = await s3.upload(params).promise()
        const location = data.Location

        return location
    } catch (e) {
        console.error(e)
        return e
    }
}

async function uploadImage (buffer, hash, extension, mimeType) {
    const params = {
        Bucket: bucket,
        Key: `${hash}.${extension}`,
        ACL: 'public-read',
        Body: buffer,
        ContentType: mimeType
    }

    try {
        const data = await s3.upload(params).promise()
        const location = data.Location

        return location
    } catch (e) {
        console.error(e)
        return e
    }
}

async function getImageList () {
    const params = {
        Bucket: bucket,
        Delimiter: '/'
    }

    try {
        const data = await s3.listObjects(params).promise()
        return data.Contents.map((content) => {
            return {
                key: content.Key,
                url: downloadableUrl(content.Key),
                lastModified: content.LastModified,
                size: content.Size
            }
        })
    } catch (e) {
        console.error(e)
        return e
    }
}

const uploadImageViaMulter = multer({
    storage: multerS3({
        s3,
        bucket,
        key: (req, file, cb) => {
            const key = `${uuid()}_${file.originalname}`
            cb(null, key)
        },
        acl: 'public-read-write'
    })
})

module.exports = {
    downloadImage,
    uploadImage,
    getImageList,
    uploadImageViaURL,
    uploadImageViaMulter
}
