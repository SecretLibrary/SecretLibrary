const imageHandler = require('../../../server-middleware/aws/modules/imageHandler');

(async () => {
    const asd = await imageHandler.uploadImageViaURL('https://upload.wikimedia.org/wikipedia/commons/c/ce/Joy_at_ICN_Airport_on_January_10%2C_2020.png', '둥둥이')
    console.log(asd)
})()
