[![view on npm](http://img.shields.io/npm/v/tesseractocr.svg?style=flat-square)](https://www.npmjs.com/package/tesseractocr)
[![downloads per month](http://img.shields.io/npm/dm/tesseractocr.svg?style=flat-square)](https://www.npmjs.com/package/tesseractocr)
[![node version](https://img.shields.io/badge/node->=8-brightgreen.svg?style=flat-square)](https://nodejs.org/download)
[![build status](https://img.shields.io/travis/schwarzkopfb/tesseract-ocr.svg?style=flat-square)](https://travis-ci.org/schwarzkopfb/tesseract-ocr)
[![test coverage](https://img.shields.io/coveralls/schwarzkopfb/tesseract-ocr.svg?style=flat-square)](https://coveralls.io/github/schwarzkopfb/tesseract-ocr)
[![license](https://img.shields.io/npm/l/tesseractocr.svg?style=flat-square)](https://github.com/schwarzkopfb/tesseractocr/blob/master/LICENSE)

# Tesseract OCR for Node.js

Simple and modern Node.js wrapper implementation for Tesseract OCR CLI.

## Features & Advantages

- focus on high performance
- both promise and callback APIs are supported
- full test coverage
- void of sync operations
- no temp files are used

## Usage

```js
import recognize from 'tesseractocr'

const text = await recognize('/path/to/image.png')
console.log('Yay! Text recognized:', text)

```

**Note:** Despite that it's encouraged to use the more modern promise-based API,
the good old callbacks are still supported.

## API docs

The overall API documentation can be found [here](/docs.md)

## Installation

There is a hard dependency on the [Tesseract project](https://github.com/tesseract-ocr/tesseract).  You can find installation instructions for various platforms on the project site. For Homebrew users, the installation is quick and easy.

    brew install tesseract

You can then go about installing the Node.js package to expose the JavaScript API:

    npm install tesseractocr

## Tests and benchmarks

Clone the repo, `npm install` and then `npm test` or `npm run benchmarks`.

## Changelog

The project's changelog is available [here](/changelog.md)

## License

[MIT](/LICENSE)
