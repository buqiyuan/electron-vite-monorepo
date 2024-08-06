import {test} from "uvu";
import {findCallExpressionsByNames} from "../src/findCallExpressionsByNames.js";
import {Project} from "ts-morph";
import * as assert from 'uvu/assert';

const project = new Project()

test('Should find call expressions only with allowed names', () => {

  const args = `('foo', 'bar')`

  const code =
    `contextBridge.exposeInMainWorld${args};\n`
    + `electron.contextBridge.exposeInMainWorld${args};\n`
    + `exposeInMainWorld${args};\n`
    + `some.another.method${args};\n`
    + `another.method${args};\n`
    + `method${args};\n`

  const allowedNames = new Set([
    'electron.contextBridge.exposeInMainWorld',
    'contextBridge.exposeInMainWorld',
    'exposeInMainWorld',
  ])

  const file = project.createSourceFile('tmp.ts', code, {overwrite: true})
  const expressionsStrings = findCallExpressionsByNames(file, allowedNames).map(e => e.getText())

  allowedNames
    .forEach(name => assert.ok(
      expressionsStrings.includes(`${name}${args}`),
      `Expected "${name}${args}" in fonded expressions`
    ))
})

test('Should ignore calls without arguments', () => {

  const code =
    `contextBridge.exposeInMainWorld();\n`
    + `electron.contextBridge.exposeInMainWorld();\n`
    + `exposeInMainWorld();\n`

  const allowedNames = new Set([
    'electron.contextBridge.exposeInMainWorld',
    'contextBridge.exposeInMainWorld',
    'exposeInMainWorld',
  ])

  const file = project.createSourceFile('tmp.ts', code, {overwrite: true})
  const expressions = findCallExpressionsByNames(file, allowedNames)
  assert.is(expressions.length, 0)
})


test('Should ignore calls with invalid arguments', () => {

  const code =
    `contextBridge.exposeInMainWorld(' ', '');\n` // Empty string as key not allowed
    + `electron.contextBridge.exposeInMainWorld(1, '');\n` // First key must be a string
    + `exposeInMainWorld({}, '');\n` // First key must be a string

  const allowedNames = new Set([
    'electron.contextBridge.exposeInMainWorld',
    'contextBridge.exposeInMainWorld',
    'exposeInMainWorld',
  ])

  const file = project.createSourceFile('tmp.ts', code, {overwrite: true})
  const expressions = findCallExpressionsByNames(file, allowedNames)
  assert.is(expressions.length, 0)
})

test.run()
