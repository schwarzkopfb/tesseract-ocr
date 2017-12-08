[![view on npm](http://img.shields.io/npm/v/tesseract-ocr.svg?style=flat-square)](https://www.npmjs.com/package/tesseract-ocr)
[![downloads per month](http://img.shields.io/npm/dm/tesseract-ocr.svg?style=flat-square)](https://www.npmjs.com/package/tesseract-ocr)
[![node version](https://img.shields.io/badge/node-%3E=4-brightgreen.svg?style=flat-square)](https://nodejs.org/download)
[![build status](https://img.shields.io/travis/schwarzkopfb/tesseract-ocr.svg?style=flat-square)](https://travis-ci.org/schwarzkopfb/tesseract-ocr)
[![test coverage](https://img.shields.io/coveralls/schwarzkopfb/tesseract-ocr.svg?style=flat-square)](https://coveralls.io/github/schwarzkopfb/tesseract-ocr)
[![license](https://img.shields.io/npm/l/tesseract-ocr.svg?style=flat-square)](https://github.com/schwarzkopfb/tesseract-ocr/blob/master/LICENSE)

# tesseract-ocr

Simple and modern Node.js wrapper for Tesseract OCR CLI.

## Features & Advantages

- focus on high performance
- both promise and callback APIs are supported
- full test coverage
- void of sync operations
- no temp files are used

## Usage

```js
const recognize = require('tesseract-ocr')

recognize(`${__dirname}/image.png`, (err, text) => {
    if (err)
        throw err
    else
        console.log('Yay! Text recognized!', text)
})

```

## Complete API docs

__TODO__

## Installation

There is a hard dependency on the [Tesseract project](https://github.com/tesseract-ocr/tesseract).  You can find installation instructions for various platforms on the project site. For Homebrew users, the installation is quick and easy.

    brew install tesseract --with-all-languages

The above will install all of the language packages available, if you don't need them all you can remove the `--all-languages` flag and install them manually, by downloading them to your local machine and then exposing the `TESSDATA_PREFIX` variable into your path:

    export TESSDATA_PREFIX=~/Downloads/

You can then go about installing the Node.js package to expose the JavaScript API:

    npm install tesseract-ocr

## License

[MIT](/LICENSE)