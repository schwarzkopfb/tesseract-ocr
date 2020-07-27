'use strict'

const which = require('which')
let binPath

module.exports = getBinaryPath

async function getBinaryPath({ execPath }) {
    const path = execPath || binPath

    return path
        ? path
        : binPath = await which('tesseract')
}