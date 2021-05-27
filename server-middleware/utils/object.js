
const excludeKey = (object, key) => {
    const { [key]: deletedKey, ...otherKeys } = object
    return otherKeys
}

module.exports = {
    excludeKey
}
