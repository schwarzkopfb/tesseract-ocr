'use strict'

const RX_LANG = /^\w*?[a-z]{3}(_[a-z]{3,4})?\w*?$/

const { equal } = require('assert'),
      { exec: execCb } = require('child_process'),
      exec = require('util').promisify(execCb),
      getBinaryPath = require('./utils/get_binary_path'),
      { InvalidExitCodeError } = require('./errors')

module.exports = listLanguages

async function listLanguages(execPath, callback) {
    try {
        let options = {}

        if (typeof execPath === 'string')
            options.execPath = execPath
        else
            callback = execPath

        if (callback)
            equal(typeof callback, 'function', 'callback must be a function')

        const tesseract = await getBinaryPath(options)
        let stdout, stderr

        try {
            ({ stdout, stderr } = await exec(`${tesseract} --list-langs`))
        }
        catch (ex) {
            // hypothetically impossible
            /* istanbul ignore next */
            throw new InvalidExitCodeError(ex.code, ex.signal, stderr)
        }

        // due to inconsistencies between
        // tesseract implementations across platforms,
        // we need to check stderr as well
        const list = (stdout || /* istanbul ignore next */ stderr)
            .split('\n')
            .filter(lang => RX_LANG.test(lang))

        if (callback)
            callback(null, list)

        return list
    }
    catch (ex) {
        // do not produce unhandledPromiseRejection if a callback is provided
        if (callback)
            callback(ex)
        else
            throw ex
    }
}