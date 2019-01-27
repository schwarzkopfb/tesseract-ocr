'use strict'

exports = module.exports = recognize

exports.withOptions =
exports.recognizeWithOptions = recognizeWithOptions
exports.list =
exports.listLanguages = listLanguages
exports.recognize = recognize
exports.cancel = cancel
exports.cancelAll = cancelAll
exports.default = recognize
exports.processCount = processCount

const RX_LANG = /^\w*?[a-z]{3}(_[a-z]{3,4})?\w*?$/

const push     = Array.prototype.push,
      EE       = require('events'),
      assert   = require('assert'),
      stream   = require('stream'),
      Duplex   = stream.Duplex,
      Readable = stream.Readable,
      CP       = require('child_process'),
      exec     = CP.exec,
      spawn    = CP.spawn,
      read     = require('fs').createReadStream,
      once     = require('once'),
      error    = require('cer'),
      which    = require('which'),
      destroy  = require('destroy'),
      IECE     = error('InvalidExitCodeError', initInvalidExitCodeError),
      procs    = new Map // map for tracking in-progress recognition processes

// make recognize() an EventEmitter to be able to fire 'warning' events when necessary
Object.setPrototypeOf(recognize, EE.prototype)
EE.call(recognize)

function initInvalidExitCodeError(message, code, signal, stderr) {
    this.code     = 'EIEC'
    this.exitCode = code
    this.signal   = signal
    this.stderr   = stderr
}

function getBinaryPath(options, cb) {
    const path =
        options.execPath ||
        getBinaryPath.resolved

    if (path)
        cb(null, path)
    else
        which('tesseract', (err, path) => {
            if (!err)
                getBinaryPath.resolved = path

            cb(err, path)
        })
}

function bufferToStream(buffer) {
    const stream = new Duplex
    stream.push(buffer)
    stream.push(null)
    return stream
}

function getInputStream(source) {
    if (typeof source === 'string')
        return read(source)
    else if (Buffer.isBuffer(source))
        return bufferToStream(source)
    else if (source instanceof Readable)
        return source
    else {
        const err = new TypeError('invalid input source provided. Only file paths (strings), ReadableStreams and Buffers are supported.')
        err.code = 'EINVI'
        throw err
    }
}

function getArgs(options) {
    const args = [ 'stdin', 'stdout' ]

    let lang =
        options.l ||
        options.lang ||
        options.language

    if (Array.isArray(lang))
        lang = lang.join('+')

    if (lang)
        args.push('-l', lang)

    const tessdataDir =
        options.dataDir ||
        options.tessdataDir ||
        options.tessDataDir

    if (tessdataDir)
        args.push('--tessdata-dir', tessdataDir)

    const userWords =
        options.words ||
        options.userWords

    if (userWords)
        args.push('--user-words', userWords)

    const userPatterns =
        options.patterns ||
        options.userPatterns

    if (userPatterns)
        args.push('--user-patterns', userPatterns)

    const psm = +options.psm

    if (!isNaN(psm)) {
        assert(psm >= 0 && psm <= 13, 'page segmentation mode must be between 0 and 13')
        args.push('--psm', psm)
    }

    const oem = +options.oem

    if (!isNaN(oem)) {
        assert(oem >= 0 && oem <= 3, 'OCR engine mode must be between 0 and 3')
        args.push('--oem', oem)
    }

    let confs =
        options.c ||
        options.conf ||
        options.confs ||
        options.config ||
        options.configs

    if (confs) {
        if (typeof confs === 'string')
            confs = [ '-c', confs ]
        else if (Array.isArray(confs))
            confs = confs.reduce((out, conf) => {
                out.push('-c', conf)
                return out
            }, [])
        else {
            assert(confs instanceof Object, 'configs option must be string, array of strings or object')

            const out = []

            for (let key in confs) {
                /* istanbul ignore next */
                if (!confs.hasOwnProperty(key))
                    continue

                out.push('-c', `${key}=${confs[ key ]}`)
            }

            confs = out
        }

        push.apply(args, confs)
    }

    let cfiles =
        options.configfile ||
        options.configfiles ||
        options.configFile ||
        options.configFiles

    if (cfiles) {
        if (typeof cfiles === 'string')
            args.push(cfiles)
        else {
            assert(Array.isArray(cfiles), 'configfile option must be string or array of strings')

            push.apply(args, cfiles)
        }
    }

    return args
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
        getBinaryPath(options, (err, tesseract) => {
            let child, stream, transform,
                stdout = '',
                stderr = ''

            if (err)
                return onError(err)

            try {
                // getInputStream() can throw
                stream = getInputStream(source)
            }
            catch (ex) {
                return onError(ex)
            }

            child = spawn(tesseract, getArgs(options))
            transform = stream.pipe(child.stdin)

            child.stdout.on('data', chunk => stdout += chunk)
            child.stderr.on('data', chunk => stderr += chunk)

            child
                .on('error', onError)
                .on('exit', (code, signal) => {
                    if (code !== 0)
                        onError(new IECE('tesseract exited with non-zero exit code. See err.exitCode, err.signal or err.stderr for more information', code, signal, stderr))
                    else {
                        onExit()

                        process.nextTick(() => {
                            // tesseract yielded some output through stderr as well,
                            // which is probably some text representing warning(s)
                            if (stderr)
                                recognize.emit('warning', stderr, source, options)

                            if (callback)
                                callback(null, stdout)
                            else
                                resolve(stdout)
                        })
                    }
                })

            stream.on('error', onError)
            transform.on('error', onError)

            process.nextTick(() => {
                procs.set(p, child)
                recognize.emit('started', p)
            })

            function onError(err) {
                onExit()

                process.nextTick(() => {
                    if (callback)
                        callback(err)
                    // do not produce unhandledPromiseRejection when a callback is provided
                    else
                        reject(err)
                })
            }

            function onExit() {
                process.nextTick(() => {
                    procs.delete(p)
                    recognize.emit('finished', p)
                })

                if (stream)
                    destroy(stream)

                if (transform)
                    destroy(transform)
            }
        })
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

function listLanguages(execPath, callback) {
    let options = {}

    if (typeof execPath === 'string')
        options.execPath = execPath
    else
        callback = execPath

    if (callback) {
        assert.equal(typeof callback, 'function', 'callback must be a function')
        callback = once(callback)
    }

    return new Promise((resolve, reject) => {
        getBinaryPath(options, (err, tesseract) => {
            if (err)
                onError(err)
            else
                exec(`${tesseract} --list-langs`, (err, stdout, stderr) => {
                    /* istanbul ignore next */
                    // hypothetically impossible :) //
                    if (err)
                        onError(new IECE('tesseract exited with non-zero exit code. See err.exitCode, err.signal or err.stderr for more information', err.code, err.signal, stderr))
                    else {
                        // !HACKERY WARNING!
                        // due to inconsistencies between
                        // tesseract implementations across platforms,
                        // we need to check stderr as well
                        const list = (stdout || stderr)
                            .split('\n')
                            .filter(lang => RX_LANG.test(lang))

                        process.nextTick(() => {
                            if (callback)
                                callback(null, list)
                            else
                                resolve(list)
                        })
                    }
                })
        })

        function onError(err) {
            process.nextTick(() => {
                if (callback)
                    callback(err)
                // do not produce unhandledPromiseRejection when a callback is provided
                else
                    reject(err)
            })
        }
    })
}
