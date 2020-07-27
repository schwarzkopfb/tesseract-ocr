'use string'

const { push }= Array.prototype,
      { isArray } = Array,
      { hasOwnProperty } = Object,
      assert = require('assert')

module.exports = getArgs

function getArgs(options) {
    const args = [ 'stdin', 'stdout' ]

    let lang =
        options.l ||
        options.lang ||
        options.language

    if (isArray(lang))
        lang = lang.join('+')

    if (lang)
        args.push('-l', lang)

    const tessdataDir =
        options.dataDir ||
        options.tessdataDir ||
        options.tessDataDir

    if (tessdataDir)
        args.push('--tessdata-dir', tessdataDir)

    const userWords =
        options.words ||
        options.userWords

    if (userWords)
        args.push('--user-words', userWords)

    const userPatterns =
        options.patterns ||
        options.userPatterns

    if (userPatterns)
        args.push('--user-patterns', userPatterns)

    const psm = +options.psm

    if (!isNaN(psm)) {
        assert(psm >= 0 && psm <= 13, 'page segmentation mode must be between 0 and 13')
        args.push('--psm', psm)
    }

    const oem = +options.oem

    if (!isNaN(oem)) {
        assert(oem >= 0 && oem <= 3, 'OCR engine mode must be between 0 and 3')
        args.push('--oem', oem)
    }

    let confs =
        options.c ||
        options.conf ||
        options.confs ||
        options.config ||
        options.configs

    if (confs) {
        if (typeof confs === 'string')
            confs = [ '-c', confs ]
        else if (isArray(confs))
            confs = confs.reduce((out, conf) => {
                out.push('-c', conf)
                return out
            }, [])
        else {
            assert(confs instanceof Object, 'configs option must be string, array of strings or object')

            const out = []

            for (let key in confs) {
                /* istanbul ignore next */
                if (!hasOwnProperty.call(confs, key))
                    continue

                out.push('-c', `${key}=${confs[ key ]}`)
            }

            confs = out
        }

        push.apply(args, confs)
    }

    let cfiles =
        options.configfile ||
        options.configfiles ||
        options.configFile ||
        options.configFiles

    if (cfiles) {
        if (typeof cfiles === 'string')
            args.push(cfiles)
        else {
            assert(isArray(cfiles), 'configfile option must be string or array of strings')

            push.apply(args, cfiles)
        }
    }

    let output = 
        options.o ||
        options.output

    if (output) {
        assert(
            output === 'alto' ||
            output === 'hocr' ||
            output === 'pdf' ||
            output === 'tsv' ||
            output === 'txt',
            'output option must be either "alto", "hocr", "pdf", "tsv" or "txt"'
        )

        args.push(output)
    }

    return args
}