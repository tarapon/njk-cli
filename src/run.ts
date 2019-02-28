import yargs from 'yargs'
import path from 'path'
import nunjucks from 'nunjucks'
import { fromPairs } from 'lodash'

interface CommandArgs {
  source: string
  data?: string
  params?: any
}

const args = <CommandArgs>yargs
  .option('source', {
    alias: 's',
  })
  .option('data', {
    alias: 'd',
  })
  .option('params', {
    alias: 'p',
  })
  .coerce('params', opts => {
    return fromPairs(opts.map((opt: string) => opt.split('=')))
  })
  .array('params')
  .demand('source').argv

const context = {
  env: process.env,
  ...(args.data ? require(path.resolve(args.data)) : {}),
  ...args.params,
}

nunjucks.configure({
  lstripBlocks: true,
  trimBlocks: true,
  throwOnUndefined: true,
})
const result = nunjucks.render(args.source, context)
process.stdout.write(result)
