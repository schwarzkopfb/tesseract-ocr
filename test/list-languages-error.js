'use strict'

const test = require('tap'),
      list = require('..').list

test.plan(2)

// hide tesseract from PATH
Object.defineProperty(process.env, 'PATH', {
    value: '/dev/null',
    writable: true
})

list(err => {
    test.type(err, Error)

    list().catch(err =>
        test.type(err, Error))
})
