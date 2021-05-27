import Vue from 'vue'
import moment from 'moment'

function setItem (target, key, value) {
    if (target) {
        if (value !== undefined) {
            Vue.set(target, key, value)
        }
    }
}

function extractItems (target, keys) {
    if (Array.isArray(keys) === false) {
        throw new TypeError('keys must be a array')
    }

    return Object.keys(target).filter(key => keys.includes(key)).reduce((prev, key) => {
        prev[key] = target[key]
        return prev
    }, {})
}

function sortByCreatedAt (items, desc = true) {
    return items.sort((a, b) => {
        const item1 = moment(a.createdAt)
        const item2 = moment(b.createdAt)
        const value = item1.isBefore(item2) ? -1 : 1

        if (desc) {
            return value
        }

        return value * -1
    })
}

export default {
    setItem,
    extractItems,
    sortByCreatedAt
}

export {
    setItem,
    extractItems,
    sortByCreatedAt
}
