'use strict'

/* hide tesseract from PATH */

Object.defineProperty(process.env, 'PATH', {
    value: '/dev/null'
})

const test      = require('tap'),
      recognize = require('..')

test.plan(2)

recognize('/dev/null', err => {
    test.type(err, Error)
    test.equals(err.code, 'ENOENT')
})

