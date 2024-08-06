import {test} from 'uvu';
import * as assert from 'uvu/assert';
import {Project} from "ts-morph";
import {findAliases} from "../src/findAliases.js";

const project = new Project()

/**
 * Helper. Gets source code and checking found aliases
 * @param {string} code
 * @param {string[]} expected expected aliases
 */
const check = (code, expected) => {
  const file = project.createSourceFile('tmp.ts', code, {overwrite: true})
  const actual = Array.from(findAliases(file))
  assert.equal(actual.sort(), expected.sort());
}

test('Default import', () => {
  // ESM
  check(`import electron from 'electron'`, ['electron.contextBridge.exposeInMainWorld'])

  // CJS
  check(`const electron = require('electron')`, ['electron.contextBridge.exposeInMainWorld'])
  check(
    `const module = 'electron';\nconst electron = require(module)`,
    ['electron.contextBridge.exposeInMainWorld']
  )
})


test('Default import with alias', () => {
  // ESM
  check(
    `import electronAlias from 'electron'`,
    ['electronAlias.contextBridge.exposeInMainWorld']
  )

  // CJS
  check(
    `const electronAlias = require('electron')`,
    ['electronAlias.contextBridge.exposeInMainWorld']
  )
})


test('Named import', () => {
  // ESM
  check(
    `import {contextBridge, unexpected} from 'electron'`,
    ['contextBridge.exposeInMainWorld']
  )

  // CJS
  check(
    `const {contextBridge, unexpected} = require('electron')`,
    ['contextBridge.exposeInMainWorld']
  )
})


test('Named import with alias', () => {
  // ESM
  check(
    `import {contextBridge as contextBridgeAlias} from 'electron'`,
    ['contextBridgeAlias.exposeInMainWorld']
  )

  // CJS
  check(
    `const {contextBridge: contextBridgeAlias} = require('electron')`,
    ['contextBridgeAlias.exposeInMainWorld']
  )
})

test('Deep object destructuring', () => {
  // CJS
  check(
    `const {contextBridge: {exposeInMainWorld, unexpected}} = require('electron');`,
    ['exposeInMainWorld']
  )
})

test('Deep object destructuring with alias', () => {
  // CJS
  check(
    `const {contextBridge: {exposeInMainWorld: exposeInMainWorldAlias}} = require('electron');`,
    ['exposeInMainWorldAlias']
  )
})


test('Combined import ', () => {
  // ESM
  check(
    `import electron, {contextBridge} from 'electron'`,
    [
      'electron.contextBridge.exposeInMainWorld',
      'contextBridge.exposeInMainWorld',
    ]
  )
})


test('Combined import with aliases', () => {
  // ESM
  check(
    `import electronAlias, {contextBridge as contextBridgeAlias} from 'electron'`,
    [
      'electronAlias.contextBridge.exposeInMainWorld',
      'contextBridgeAlias.exposeInMainWorld',
    ]
  )
})

test('Type-only default imports should be ignored', () => {
  // ESM
  check(
    `import type Electron from 'electron'`,
    []
  )
})


test('Type-only named imports should be ignored', () => {
  // ESM
  check(
    `import type {contextBridge} from 'electron'`,
    []
  )
})


test('Type-only named imports should be ignored', () => {
  // ESM
  check(
    `import {type contextBridge} from 'electron'`,
    []
  )
})

test('Should return empty array if no relevant imports', () => {
  // ESM
  check(
    `import {somethingElse} from 'electron';\n`
    + `import notElectron from 'notElectron';\n`
    + `import unexpected from '';\n`
    + `import 'electron';\n`,
    []
  )

  // CJS
  check(
    `const {somethingElse} = require('electron');\n`
    + `const notElectron = require('notElectron');\n`
    + `const unexpected = require();\n`
    + `require('electron');\n`,
    []
  )
})


test.run()
