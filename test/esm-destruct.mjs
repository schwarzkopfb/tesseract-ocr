import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

import test from 'tap'
import { recognize } from '../lib/recognize.mjs'

test.resolveMatch(recognize(__dirname + '/fixtures/github-logo.png'), 'GitHub')
