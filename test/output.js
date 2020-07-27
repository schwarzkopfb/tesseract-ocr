const test = require('tap'),
      recognize = require('..'),
      imgPath = `${__dirname}/fixtures/github-logo.png`

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>'

function isPDF(val) {
    return (
        val.lastIndexOf('%PDF-') === 0 && 
        val.lastIndexOf('%%EOF') > -1
    )
}

// test.plan(6)
test.plan(4)

// test.resolveMatch(recognize(imgPath, { o: 'alto' }), XML_HEADER, 'alto')
test.resolveMatch(recognize(imgPath, { output: 'hocr' }), XML_HEADER, 'hocr')
// test.resolveMatch(recognize(imgPath, { o: 'tsv' }), /\s+GitHub\s+/, 'tsv')
test.resolveMatch(recognize(imgPath, { output: 'txt' }), 'GitHub\n', 'txt')

recognize(imgPath, { o: 'pdf' })
    .then(res => test.ok(isPDF(res), 'pdf'))
    .catch(test.threw)

test.rejects(() => recognize(imgPath, { output: 'invalid' }), 'invalid')
