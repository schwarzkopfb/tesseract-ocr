'use strict'

const fs        = require('fs'),
      http      = require('http'),
      path      = require('path'),
      server    = http.createServer(sendFile).listen(onListening),
      test      = require('tap'),
      recognize = require('..')

// test.plan(4)
test.plan(1)

// recognize.on('warning', (stderr, source, options) => {
//     test.equals(stderr.trim(), 'Warning. Invalid resolution 0 dpi. Using 70 instead.')
//     test.type(source, http.IncomingMessage)
//     test.same(options, {})
// })

function sendFile(req, res) {
    res.setHeader('content-type', 'image/png')
    fs.createReadStream(path.join(__dirname, 'fixtures', 'github-logo.png')).pipe(res)
}

function onListening() {
    http.get(server.address(), res => {
        recognize(res, (err, text) => {
            if (err)
                test.threw(err)
            else {
                test.equals(text.trim(), 'GitHub')
                server.close()
            }
        })
    })
}
