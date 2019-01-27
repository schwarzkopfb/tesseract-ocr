'use strict'

const fs        = require('fs'),
      http      = require('http'),
      server    = http.createServer(dontRespond).listen(onListening),
      test      = require('tap'),
      recognize = require('..')

test.plan(10)

function dontRespond(req, res) {
    // generate an infinite timeout...
    res.flushHeaders()
}

function createProcess() {
    http.get(server.address(), res => {
        recognize(res)
            .catch(err => test.equals(err.code, 'EIEC', 'process should exit with non-zero exit code'))
    })
}

function onListening() {
    test.equals(recognize.processCount(), 0, 'no process should be running')

    for (let i = 0; i < 3; i++)
        createProcess()

    let ctr = 0

    recognize.on('started', p => {
        test.equals(recognize.processCount(), ++ctr, 'process should be started')

        if (ctr === 3)
            recognize.cancelAll()
    })

    recognize.on('finished', p => {
        test.equals(recognize.processCount(), --ctr, 'process should be canceled')

        if (ctr === 0)
            server.close()
    })
}
