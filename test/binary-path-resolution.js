'use strict'

/* tesseract binary path should be recognized only once (using `which`) */

const path      = require('path').join(__dirname, 'fixtures', 'google-logo.jpg'),
      test      = require('tap'),
      recognize = require('..')

test.plan(4)

recognize(path, (err, text) => {
    test.notOk(err)
    test.equals(text.trim(), 'Google')

    recognize(path, (err, text) => {
        test.notOk(err)
        test.equals(text.trim(), 'Google')
    })
})
