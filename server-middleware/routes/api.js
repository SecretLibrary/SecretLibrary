
const images = require('./modules/images')
const auth = require('./modules/auth')
const meetings = require('./modules/meetings')
const hello = require('./modules/hello')
const ping = require('./modules/ping')
const members = require('./modules/members')
const places = require('./modules/places')
const category = require('./modules/category')
const questions = require('./modules/questions')
const books = require('./modules/books')
const articles = require('./modules/articles')
const user = require('./modules/user')
const social = require('./modules/social')
const comments = require('./modules/comments')
const likey = require('./modules/likey')
const library = require('./modules/library')

module.exports = [
    { path: '/images', router: images },
    { path: '/auth', router: auth },
    { path: '/meetings', router: meetings },
    { path: '/hello', router: hello },
    { path: '/members', router: members },
    { path: '/ping', router: ping },
    { path: '/places', router: places },
    { path: '/category', router: category },
    { path: '/questions', router: questions },
    { path: '/books', router: books },
    { path: '/articles', router: articles },
    { path: '/user', router: user },
    { path: '/social', router: social },
    { path: '/comments', router: comments },
    { path: '/likey', router: likey },
    { path: '/library', router: library }
]
