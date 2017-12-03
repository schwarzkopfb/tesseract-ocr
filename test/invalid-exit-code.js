'use strict'

/* pass in an invalid language identifier */

const test      = require('tap'),
      recognize = require('..')

test.plan(6)

recognize('/dev/null', { l: 'invalid' }, err => {
    test.type(err, Error)
    test.equals(err.code, 'EIEC')
    test.equals(err.exitCode, 1)
})

recognize('/dev/null', { l: 'invalid' }).catch(err => {
    test.type(err, Error)
    test.equals(err.code, 'EIEC')
    test.equals(err.exitCode, 1)
})
