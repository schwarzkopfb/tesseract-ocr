'use strict'

exports = module.exports = recognize

exports.withOptions =
exports.recognizeWithOptions = recognizeWithOptions
exports.list =
exports.listLanguages = require('./list_languages')
exports.recognize = recognize
exports.cancel = cancel
exports.cancelAll = cancelAll
exports.processCount = processCount

const assert = require('assert'),
      EventEmitter = require('events'),
      { spawn } = require('child_process'),
      once = require('once'),
      destroy = require('destroy'),
      getArgs = require('./utils/get_args'),
      getBinaryPath = require('./utils/get_binary_path'),
      getInputStream = require('./utils/get_input_stream'),
      { InvalidExitCodeError } = require('./errors'),
      procs = new Map // map for tracking in-progress recognition processes

// make recognize() an EventEmitter to be able to fire 'warning' events when necessary
Object.setPrototypeOf(recognize, EventEmitter.prototype)
EventEmitter.call(recognize)

function emit(event, ...args) {
    process.nextTick(() => recognize.emit(event, ...args))
}

function recognizeWithOptions(options) {
    return function recognizeWithOptions(source, callback) {
        return recognize(source, options, callback)
    }
}

function recognize(source, options, callback) {
    assert(source, 'source parameter is required')

    switch (typeof options) {
        case 'function':
            callback = options
            options = {}
            break

        case 'undefined':
            options = {}
    }

    if (callback) {
        assert.equal(typeof callback, 'function', 'callback must be a function')
        callback = once(callback)
    }

    const p = new Promise((resolve, reject) => {
        getBinaryPath(options)
            .then(tesseract => {
                // getInputStream() may throw and if that happens after
                // `child` is created than the process hangs up.
                // So don't change the order of the following lines!
                const stream = getInputStream(source),
                      child = spawn(tesseract, getArgs(options)),
                      transform = stream.pipe(child.stdin)

                let stdout = '',
                    stderr = ''

                child.stdout.on('data', chunk => stdout += chunk)
                child.stderr.on('data', chunk => stderr += chunk)

                child
                    .on('error', onError)
                    .on('exit', (code, signal) => {
                        if (code !== 0)
                            onError(new InvalidExitCodeError(code, signal, stderr))
                        else {
                            // tesseract yielded some output through stderr as well,
                            // which is probably some text representing warning(s)
                            if (stderr)
                                emit('warning', stderr, source, options)

                            dispose()
                            settle(null, stdout)
                        }
                    })

                stream.on('error', onError)
                transform.on('error', onError)

                procs.set(p, child)
                emit('started', p)

                function dispose() {
                    procs.delete(p)
                    emit('finished', p)
                    destroy(stream)
                    destroy(transform)
                }
        
                function onError(err) {
                    dispose()
                    settle(err)
                }
            })
            .catch(settle)

        function settle(err, res) {
            // do not produce unhandledPromiseRejection when a callback is provided
            if (callback)
                callback(err, res)
            else if (err)
                reject(err)
            else
                resolve(res)
        }
    })

    return p
}

function cancel(promise) {
    const proc = procs.get(promise)

    if (proc)
        proc.kill()
}

function cancelAll() {
    procs.forEach(proc => proc.kill())
}

function processCount() {
    return procs.size
}
