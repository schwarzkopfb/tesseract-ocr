'use strict'

const join      = require('path').join,
      test      = require('tap'),
      tesseract = require('..'),
      recognize = tesseract.withOptions({
          l: [ 'hun', 'eng' ]
      })

test.plan(1)

recognize(join(__dirname, 'fixtures', 'hun.png'), (err, text) => {
    test.equals(text.trim(), 'Hány betűből áll a szakácskönyv szó?')
})
