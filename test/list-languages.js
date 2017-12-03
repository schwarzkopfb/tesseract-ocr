'use strict'

// we're testing against tesseract v3.05.01 with --all-languages
const expected = [
    'afr', 'amh', 'ara', 'asm', 'aze', 'aze_cyrl',
    'bel', 'ben', 'bod', 'bos', 'bul', 'cat',
    'ceb', 'ces', 'chi_sim', 'chi_tra', 'chr', 'cym',
    'dan', 'dan_frak', 'deu', 'deu_frak', 'dzo', 'ell',
    'eng', 'enm', 'epo', 'equ', 'est', 'eus',
    'fas', 'fin', 'fra', 'frk', 'frm', 'gle',
    'glg', 'grc', 'guj', 'hat', 'heb', 'hin',
    'hrv', 'hun', 'iku', 'ind', 'isl', 'ita',
    'ita_old', 'jav', 'jpn', 'kan', 'kat', 'kat_old',
    'kaz', 'khm', 'kir', 'kor', 'kur', 'lao',
    'lat', 'lav', 'lit', 'mal', 'mar', 'mkd',
    'mlt', 'msa', 'mya', 'nep', 'nld', 'nor',
    'ori', 'osd', 'pan', 'pol', 'por', 'pus',
    'ron', 'rus', 'san', 'sin', 'slk', 'slk_frak',
    'slv', 'spa', 'spa_old', 'sqi', 'srp', 'srp_latn',
    'swa', 'swe', 'syr', 'tam', 'tel', 'tgk',
    'tgl', 'tha', 'tir', 'tur', 'uig', 'ukr',
    'urd', 'uzb', 'uzb_cyrl', 'vie', 'yid'
]

const test = require('tap'),
      list = require('..').list,
      ep   = require('which').sync('tesseract')

test.plan(2)

function compare(required, provided) {
    for (let item of required)
        if (!~provided.indexOf(item))
            return false

    return true
}

list().then(actual => {
    test.ok(compare(actual, expected))

    list(ep, (err, actual) => {
        if (err)
            test.threw(err)
        else
            test.ok(compare(actual, expected))
    })
})
