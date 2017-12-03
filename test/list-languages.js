'use strict'

// we're testing against tesseract v3.05.01
const expected = [
    'eng', 'hun'
]

const test = require('tap'),
      list = require('..').list,
      ep   = require('which').sync('tesseract')

test.plan(2)

function compare(required, provided) {
    for (let item of required)
        if (!~provided.indexOf(item))
            return false

    return true
}

list().then(actual => {
    test.ok(compare(expected, actual))

    list(ep, (err, actual) => {
        if (err)
            test.threw(err)
        else
            test.ok(compare(expected, actual))
    })
})
