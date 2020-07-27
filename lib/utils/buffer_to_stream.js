'use strict'

const { Duplex } = require('stream')

module.exports = bufferToStream

function bufferToStream(buffer) {
    const stream = new Duplex
    stream.push(buffer)
    stream.push(null)
    return stream
}