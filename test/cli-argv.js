'use strict'

/*
    we only have to test the generated argv passed to tesseract,
    so override spawn() with a test function to validate that
*/

const _spawn = require('child_process').spawn

require('child_process').spawn = spawn

const test      = require('tap'),
      recognize = require('..')

const tests = [
    [ 'stdin', 'stdout', '--tessdata-dir', '/test' ],
    [ 'stdin', 'stdout', '--tessdata-dir', '/test' ],
    [ 'stdin', 'stdout', '--tessdata-dir', '/test' ],
    [ 'stdin', 'stdout', '--user-words', '/test' ],
    [ 'stdin', 'stdout', '--user-words', '/test' ],
    [ 'stdin', 'stdout', '--user-patterns', '/test' ],
    [ 'stdin', 'stdout', '--user-patterns', '/test' ],
    [ 'stdin', 'stdout', '--psm', '3' ],
    [ 'stdin', 'stdout', '--oem', '3' ]
    // -l is used in other tests
]

let counter = 0

function spawn(cmd, args) {
    test.same(args, tests[ counter++ ])
    return _spawn.apply(null, arguments)
}

// not so fancy, however our counter is sync...
recognize('/dev/null', { dataDir: '/test' }, () => {
    recognize('/dev/null', { tessdataDir: '/test' }, () => {
        recognize('/dev/null', { tessDataDir: '/test' }, () => {
            recognize('/dev/null', { words: '/test' }, () => {
                recognize('/dev/null', { userWords: '/test' }, () => {
                    recognize('/dev/null', { patterns: '/test' }, () => {
                        recognize('/dev/null', { userPatterns: '/test' }, () => {
                            recognize('/dev/null', { psm: '3' }, () => {
                                recognize('/dev/null', { oem: '3' }, () => {})
                            })
                        })
                    })
                })
            })
        })
    })
})
