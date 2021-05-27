import { extractItems } from '~/utils/Object'

function user (target) {
    const keys = ['profileImage', 'userId', 'userName']
    return extractItems(target, keys)
}

function book (target) {
    const keys = ['isbn', 'thumbnail', 'url', 'title', 'contents', 'authors', 'datetime', 'price', 'publisher']
    return extractItems(target, keys)
}

export default {
    user,
    book
}

export {
    user,
    book
}
