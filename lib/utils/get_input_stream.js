'use strict'

const { isBuffer } = Buffer,
      { Readable } = require('stream'),
      { createReadStream } = require('fs'),
      bufferToStream = require('./buffer_to_stream'),
      { InvalidInputSourceError } = require('../errors')

module.exports = getInputStream

function getInputStream(source) {
    if (typeof source === 'string')
        return createReadStream(source)
    else if (isBuffer(source))
        return bufferToStream(source)
    else if (source instanceof Readable)
        return source
    else
        throw new InvalidInputSourceError
}