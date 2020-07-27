
import Compressor from 'compressorjs'

function preprocessImage (file, maxWidth = 2048, quality = 0.8) {
    return new Promise((resolve, reject) => {
        return new Compressor(file, {
            maxWidth,
            quality,
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
