import fs from "node:fs";
import path from "node:path";
import {test} from "uvu";
import * as assert from "uvu/assert";
import {makeSnapshots} from "../scripts/make-snapshots.js";
import {tmpdir} from "os";

const SNAPSHOTS_DIR_PATH = path.resolve('./examples')
const OUTPUT_DIR_PATH = fs.mkdtempSync(path.join(tmpdir(), 'dts-cb-test-snapshots'))

makeSnapshots(SNAPSHOTS_DIR_PATH, OUTPUT_DIR_PATH)
const expectedSnapshots = new Set(fs.readdirSync(SNAPSHOTS_DIR_PATH).filter(e => e.endsWith('.d.ts')))
const actualSnapshots = new Set(fs.readdirSync(SNAPSHOTS_DIR_PATH).filter(e => e.endsWith('.d.ts')))


test('Must create an identical number of snapshots', () => {
  assert.is(expectedSnapshots.size, actualSnapshots.size)
  expectedSnapshots.forEach(e => assert.ok(actualSnapshots.has(e)))
})

actualSnapshots.forEach(fileName => {
  test(fileName, () => {
    const expected = fs.readFileSync(path.resolve(SNAPSHOTS_DIR_PATH, fileName), 'utf8')
    const actual = fs.readFileSync(path.resolve(OUTPUT_DIR_PATH, fileName), 'utf8')
    assert.snapshot(actual, expected)
  })
})

test.run()
