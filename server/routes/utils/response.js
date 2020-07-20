/*
{
    message: "The provided key element does not match the schema",
    time: "2020-04-20T14:45:00.371Z",
    requestId: "6DLG3QM9L5UV8QCFPDKCNSJDAVVV4KQNSO5AEMVJF66Q9ASUAAJG",
    statusCode: 400,
    retryable: false,
    retryDelay: 31.429396117777152,
}
*/

const getRegularMessageStructure = ({ message = null, status = 200, time = new Date(), result = null }) => {
    return {
        message,
        status,
        time,
        result
    }
}

function redirect (res, url, status = 302) {
    return res.status(status).redirect(url)
}

function success (res, result) {
    const messages = getRegularMessageStructure({ result })
    return res.status(200).json(messages)
}

function failed (res, { message, status = 400, time = new Date() }) {
    const messages = getRegularMessageStructure({ message, status, time })
    return res.status(status).json(messages)
}

module.exports = {
    success,
    failed,
    redirect
}
