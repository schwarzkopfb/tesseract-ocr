'use strict'

const test      = require('tap'),
      path      = require('path'),
      recognize = require('..')

test.plan(1)

recognize(path.join(__dirname, 'fixtures', 'hun.png'), { lang: 'hun' }).then(text => {
    test.equals(text.trim(), 'Hány betűből áll a szakácskönyv szó?')
})

