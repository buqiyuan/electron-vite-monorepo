# Electron Vite Monorepo

[中文文档](./README.zh-CN.md)

> A production-ready Electron desktop application template built with Vue 3 + Vite + TypeScript, managed as a monorepo with pnpm workspaces and Turborepo.

## Features

- **Electron 40** — Desktop application framework
- **Vue 3** — Progressive JavaScript framework with `<script setup>` SFC
- **Vite 7** — Next-generation frontend build tooling
- **TypeScript** — Full type safety across all packages
- **pnpm Workspaces** — Efficient monorepo dependency management
- **Turborepo** — High-performance build orchestration with caching
- **Auto Update** — Built-in application updater support (full update + patch update + web update)
- **IPC Type Safety** — Typed inter-process communication between main, preload, and renderer
- **Code Obfuscation** — Custom Vite plugin for JavaScript obfuscation

## Project Structure

```
electron-vite-monorepo/
├── apps/
│   ├── electron/          # Electron main process (electron-main)
│   ├── preload/           # Preload scripts (@repo/electron-preload)
│   ├── web/               # Renderer process - Vue 3 app (electron-web)
│   └── docs/              # Documentation site (VitePress)
├── packages/
│   ├── backend-api/       # Backend API client (@roxy/backend-api)
│   ├── shared-types/      # Shared TypeScript types (@repo/shared-types)
│   └── vite-plugin/       # Custom Vite plugins (@repo/vite-plugin)
├── scripts/
│   └── watch.ts           # Dev orchestration script
├── turbo.json             # Turborepo configuration
└── pnpm-workspace.yaml    # pnpm workspace configuration
```

### Dependency Graph

```
apps/electron (electron-main)
├── @repo/electron-preload
└── @repo/shared-types

apps/preload (@repo/electron-preload)
└── @repo/shared-types

apps/web (electron-web)
├── @repo/electron-preload
└── @repo/shared-types

packages/backend-api (@roxy/backend-api)
└── peer: axios

packages/shared-types (@repo/shared-types)   # Leaf package, type definitions
packages/vite-plugin (@repo/vite-plugin)     # Standalone, obfuscation + minification
```

## Prerequisites

- **Node.js** >= 22.20.0
- **pnpm** >= 10.18.3

> **Tip:** This project uses [Volta](https://volta.sh/) to manage Node.js and pnpm versions. If you have Volta installed, the correct versions will be used automatically.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/buqiyuan/electron-vite-monorepo.git
cd electron-vite-monorepo
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start development

```bash
pnpm dev
```

This will:
1. Start the Vite dev server for the renderer (web) process
2. Build and watch the preload scripts
3. Build and watch the main process, then launch Electron with `--inspect` flag

### For China Users / 中国用户

If you are in China, you can use the Taobao npm mirror for faster downloads. Uncomment the following lines in `.npmrc`:

```ini
registry = https://registry.npmmirror.com
```

For Electron binary downloads, run:

```bash
pnpm config set electron_mirror "https://npmmirror.com/mirrors/electron/"
```

Or set environment variables:

```bash
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start all apps in development mode with HMR |
| `pnpm build` | Build all packages and apps via Turborepo |
| `pnpm pack:dev` | Build and package Electron app (development) |
| `pnpm pack:prod` | Build and package Electron app (production) |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm lint:fix` | Auto-fix ESLint issues |
| `pnpm clean:cache` | Clear build caches |
| `pnpm clean:lib` | Remove all `node_modules` directories |
| `pnpm reinstall` | Clean lock file and reinstall all dependencies |

## Tech Stack

| Category | Technology |
| --- | --- |
| Desktop Framework | Electron 40 |
| Frontend Framework | Vue 3 |
| Build Tool | Vite 7 |
| Language | TypeScript 5 |
| Monorepo | pnpm Workspaces + Turborepo |
| Linting | ESLint (with @antfu/eslint-config) |
| Packaging | electron-builder |
| Auto Update | electron-updater |

## License

[MIT](./LICENSE)

## Author

[buqiyuan](https://github.com/buqiyuan)
