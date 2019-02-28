#!/usr/bin/env node
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
  .usage("njk -s template/tmpl.njk -d template/data.json -p v1=1 -p v2=2")
  .option('source', {
    alias: 's',
    description: "Source njk template",
  })
  .option('data', {
    alias: 'd',
    description: "Json file with variables",
  })
  .option('params', {
    alias: 'p',
    description: "Key-value pairs of variables, ex: name=hello"
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
