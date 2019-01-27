'use strict'

const fs        = require('fs'),
      http      = require('http'),
      server    = http.createServer(dontRespond).listen(onListening),
      test      = require('tap'),
      recognize = require('..')

test.plan(7)

function dontRespond(req, res) {
    // generate an infinite timeout...
    res.flushHeaders()
}

function onListening() {
    http.get(server.address(), res => {
        test.equals(recognize.processCount(), 0, 'no process should be running')
        const proc = recognize(res)

        proc.catch(err => test.equals(err.code, 'EIEC', 'process should exit with non-zero exit code'))

        recognize.on('started', p => {
            test.equals(p, proc, 'promise should be passed through start event')
            test.equals(recognize.processCount(), 1, 'one process should be running')

            recognize.on('finished', p => {
                test.equals(p, proc, 'promise should be passed through finished event')
                test.equals(recognize.processCount(), 0, 'process should be canceled')

                server.close()
            })

            recognize.cancel(p)

            test.doesNotThrow(() => {
                recognize.cancel('test')
            })
        })
    })
}
