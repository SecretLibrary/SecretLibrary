const imageHandler = require('../modules/imageHandler');

(async () => {
    try {
        const res = await imageHandler.uploadImageViaUrl('http://k.kakaocdn.net/dn/h4UCD/btqCmsNqCP7/R8omh48mXaWcLezPYk3Vpk/m1.jpg', 'profile', 'hello')
        console.log(res)
    } catch (e) {
        console.error(e)
    }
})()
