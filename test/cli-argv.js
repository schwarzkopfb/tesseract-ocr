'use strict'

/*
    we only have to test the generated argv passed to tesseract,
    so override spawn() with a test function to validate that
*/

const _spawn = require('child_process').spawn

require('child_process').spawn = spawn

const test      = require('tap'),
      recognize = require('..')

const opts = [
    // -l is used in other tests
    { dataDir: '/test' },
    { tessdataDir: '/test' },
    { tessDataDir: '/test' },
    { words: '/test' },
    { userWords: '/test' },
    { patterns: '/test' },
    { userPatterns: '/test' },
    { psm: '3' },
    { oem: '3' },
    { c: 'TEST1=TEST' },
    { conf: 'test2=test' },
    { confs: [ 't3=test', 't4=test' ] },
    { configs: { t5: 'test', t6: 'test' } }
]

const expected = [
    [ 'stdin', 'stdout', '--tessdata-dir', '/test' ],
    [ 'stdin', 'stdout', '--tessdata-dir', '/test' ],
    [ 'stdin', 'stdout', '--tessdata-dir', '/test' ],
    [ 'stdin', 'stdout', '--user-words', '/test' ],
    [ 'stdin', 'stdout', '--user-words', '/test' ],
    [ 'stdin', 'stdout', '--user-patterns', '/test' ],
    [ 'stdin', 'stdout', '--user-patterns', '/test' ],
    [ 'stdin', 'stdout', '--psm', '3' ],
    [ 'stdin', 'stdout', '--oem', '3' ],
    [ 'stdin', 'stdout', '-c', 'TEST1=TEST' ],
    [ 'stdin', 'stdout', '-c', 'test2=test' ],
    [ 'stdin', 'stdout', '-c', 't3=test', '-c', 't4=test' ],
    [ 'stdin', 'stdout', '-c', 't5=test', '-c', 't6=test' ]
]

let counter = 0

function spawn(cmd, args) {
    test.same(args, expected[ counter++ ])
    return _spawn.apply(null, arguments)
}

~function run() {
    const next = opts[ counter ]

    if (next)
        recognize('/dev/null', next)
            // tesseract will not exit with zero, 'cause of the provided args are invalid,
            // however we don't have to care about that at this point, since we're testing
            // only the generated argv format, so run() is just fine as error handler
            .then(run, run)
}()
