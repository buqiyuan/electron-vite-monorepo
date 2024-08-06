#!/usr/bin/env node

import coa from 'coa'
import {generate} from "../dist/dts-cb.js";

coa.Cmd()
  .name(process.argv[1])
  .helpful()
  .end()
  .opt()
  .name('input')
  .title('Glob pattern for input files or path to tsconfig.json')
  .short('i')
  .long('input')
  .req()
  .end()
  .opt()
  .name('output')
  .title('Output path')
  .long('output')
  .short('o')
  .req()
  .end()
  .act((opts) => generate(opts))
  .run(process.argv.slice(2))

