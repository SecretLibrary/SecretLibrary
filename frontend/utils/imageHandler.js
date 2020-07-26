
import Compressor from 'compressorjs'

function preprocessImage (file) {
    return new Promise((resolve, reject) => {
        return new Compressor(file, {
            maxWidth: 2048,
            quality: 0.8,
            success (file) {
                return resolve(file)
            },
            error (error) {
                return reject(error)
            }
        })
    })
}

export default {
    preprocessImage
}

export {
    preprocessImage
}
