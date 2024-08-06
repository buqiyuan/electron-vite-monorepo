# dts-cb

This utility is designed to
analyze [context bridges in Electron application](https://www.electronjs.org/ru/docs/latest/api/context-bridge) and
create `.d.ts` files.

## Problem

In one part of your application, you describe some API and expose it into the global context of the renderer.

```js
contextBridge.exposeInMainWorld("electron", {
  doThing: () => ipcRenderer.send("do-a-thing"),
});
```

However, for the TypeScript in the renderer knows nothing about the new global api.

```js
// Property 'electron' does not exist on type 'Window & typeof globalThis'.
window.electron.doThing();
```

Therefore, you must somehow register these apps.

## Decision

This utility scans the source code and finds all `exposeInMainWorld` calls. Then it generates a `.d.ts` file with an
interface that can later be connected in the renderer.

```js
contextBridge.exposeInMainWorld("electron", {
  doThing: () => ipcRenderer.send("do-a-thing"),
});
```

```ts
// generated.d.ts
interface Window {
  readonly electron: { doThing: () => void };
}
```

**See more [examples](/examples).**

## Installation

```bash
# global
npm i -g dts-for-context-bridge

# for project
npm i dts-for-context-bridge
```

## Usage

```bash
# You can use glob pattern as input
dts-cb --input="preload/src/**/*.ts" --output="preload/exposed.d.ts"

# You can use tsconfig.json as input
dts-cb --input="preload/tsconfig.json" --output="preload/exposed.d.ts"
```

See all options by

```bash
dts-cb --help
```

### Programmatic usage

```js
import { generate } from "dts-for-context-bridge";

generate({
  input: "preload/src/**/*.ts", // Or path to tsconfig.json
  output: "preload/exposed.d.ts",
});
```

## Is it stable?

The utility relies on AST analysis and currently does not cover all cases. **Feel free to create PR.**
