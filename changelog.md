# Changes

## 2.0.0

* Parallel tests, modern JavaScript and drop support for Node < 8
* Add ESM support
* Update vulnerable dependencies
* Drop unnecessary dep: `cer`
* Reorganize code

## 1.2.0

* Added API for cancelling ongoing recognition processes.

* Introduced:
  * Method: `tesseract.recognize.cancel(process)`
  * Method: `tesseract.recognize.cancelAll()`
  * Event: `started`
  * Event: `finished`
