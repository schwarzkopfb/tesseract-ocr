'use strict'

const test      = require('tap'),
      recognize = require('..')

test.plan(2)

recognize(true, err => {
    test.type(err, TypeError)
    test.equals(err.code, 'EINVI')
})