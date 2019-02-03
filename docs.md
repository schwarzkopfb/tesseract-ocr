# API Documentation of `tesseractocr` Node.js module

## Methods

```js
const tesseract = require('tesseractocr')
```

### tesseract.recognize(source, [options], [callback]) : Promise

Pass an image to Tesseract to recognize text from it.
This method spawns a new tesseract process with the given options and streams the source into it.
Callback is fired when the child process gets finished.

* `source` can be a file path, a `stream.Readable` or a `Buffer`
* `options` is an object containing options for the recognition process. All the following options are optional:
    * `execPath` specify the path of tesseract executable. Defaults to `which tesseract` (searches `PATH`).
    * `language` specify language(s) used for OCR. This can be a string or an array of strings
    * `tessdataDir` specify the location of tessdata path
    * `userWords` specify the location of user words file
    * `userPatterns` specify the location of user patterns file
    * `config` set value for config variables. This can be a string, an array of strings or an object specifying key-value pairs
    * `configfiles` One or more file path(s) pointing to tesseract configuration files. This can be a string or an array of strings
    * `psm` specify page segmentation mode
    * `oem` specify OCR Engine mode
* `callback(err, text)` an optional error-first callback function

#### Examples

```js
tesseract.recognize(`${__dirname}/image.png`, (err, text) => { /* ... */ })
tesseract.recognize(Buffer.from(/* ... */), (err, text) => { /* ... */ })
tesseract.recognize(fs.createReadStream(/* ... */), (err, text) => { /* ... */ })
tesseract.recognize('image.jpeg', { language: 'swe' }, (err, text) => { /* ... */ })
tesseract.recognize('image.tiff').then(console.log, console.error)
```

### tesseract.withOptions(options) : function(source, [callback])

Factory to create custom recognizer functions with fixed options.
Parameters are identical to `recognize()`.

#### Examples

```js
const recognize = tesseract.withOptions({
    psm: 4,
    language: [ 'fin', 'eng' ]
})

recognize(`${__dirname}/image.png`, (err, text) => { /* ... */ })
recognize(Buffer.from(/* ... */), (err, text) => { /* ... */ })
recognize(fs.createReadStream(/* ... */), (err, text) => { /* ... */ })
recognize('image.jpeg', (err, text) => { /* ... */ })
recognize('image.tiff').then(console.log, console.error)
```

### tesseract.recognize.cancel(promise) : undefined

* `promise` the `Promise` instance returned by the `recognize()` call that initiated the given recognition process.

Abort an ongoing recognition process.

#### Examples

```js
const proc = tesseract.recognize(source)

// ... for e.g. an http server...
request.on('timeout', () => tesseract.recognize.cancel(proc))
```

### tesseract.recognize.cancelAll() : undefined

Abort all the ongoing recognition processes.

#### Examples

```js
for (let i = 0; i < 10; i++) {
    tesseract
        .recognize(source + i)
        .then(console.log)
}

process.on('exit', () => tesseract.recognize.cancelAll())
```

### tesseract.listLanguages([execPath], [callback]) : Promise

Get the list of the installed languages on the current system.

* `execPath` specify the path of tesseract executable. Defaults to `which tesseract` (searches `PATH`).
* `callback(err, list)` an optional error-first callback function

#### Examples

```js
tesseract.listLanguages((err, list) => { /* ... */ })
tesseract.listLanguages('/usr/local/bin/tesseract', (err, list) => { /* ... */ })
tesseract.listLanguages().then(console.log, console.error)
```

## Notes

### #1

The module's main export is the `recognize()` method itself, so you can simply:

```js
const recognize = require('tesseractocr')

recognize('source', (err, text) => { /* ... */ })
```

### #2

All the methods of this module are supporting both callback and promise based usage.
That means these are working well with async functions:

```js
async function parseTextFromImage(source) {
    let text = await recognize(source)

    // do stuff with recognized text...
    text = text.split(' ')

    return text
}
```  

### #3

Recognition can be aborted in the event of e.g. a client timeout. This terminates the given Tesseract child process:

```js
const proc = reconize(source)

request.on('timeout', () => recognize.cancel(proc))
```

It's also possible to terminate all the in-progress Tesseract processes in the event of e.g. force shutdown:

```js
process.on('exit', () => recognize.cancelAll())
```
