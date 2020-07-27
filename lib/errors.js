'use strict'

class InvalidExitCodeError extends Error {
    constructor(code, signal, stderr) {
        super('tesseract exited with non-zero exit code. See err.exitCode, err.signal or err.stderr for more information')
        this.code = 'EIEC'
        this.signal = signal
        this.stderr = stderr
        this.exitCode = code
    }
}

class InvalidInputSourceError extends TypeError {
    constructor() {
        super('invalid input source provided. Only file paths (strings), ReadableStreams and Buffers are supported')
        this.code = 'EINVI'
    }
}

module.exports = {
    InvalidExitCodeError,
    InvalidInputSourceError
}
