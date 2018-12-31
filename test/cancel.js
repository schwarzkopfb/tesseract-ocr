'use strict'

const test      = require('tap'),
      path      = require('path'),
      recognize = require('..')

test.plan(1)

const ocr = () => recognize(path.join(__dirname, 'fixtures', 'nyt.png'),{}).then(result => {
    return test.equals(result, undefined)
})

const bail = () => Promise.resolve(sleep(1500)).then(recognize.cancel)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

Promise.all([ocr(), bail()]).catch(test.threw)
