# Electron Vite Monorepo

[English](./README.md)

> 一个基于 Vue 3 + Vite + TypeScript 构建的生产级 Electron 桌面应用模板，使用 pnpm workspaces 和 Turborepo 进行 monorepo 管理。

## 特性

- **Electron 40** — 桌面应用框架
- **Vue 3** — 渐进式 JavaScript 框架，支持 `<script setup>` SFC
- **Vite 7** — 下一代前端构建工具
- **TypeScript** — 所有包全类型安全
- **pnpm Workspaces** — 高效的 monorepo 依赖管理
- **Turborepo** — 高性能构建编排，支持缓存
- **自动更新** — 内置应用更新支持（全量更新 + 补丁更新 + Web 更新）
- **IPC 类型安全** — 主进程、预加载脚本和渲染进程之间的类型化进程间通信
- **代码混淆** — 自定义 Vite 插件实现 JavaScript 代码混淆

## 项目结构

```
electron-vite-monorepo/
├── apps/
│   ├── electron/          # Electron 主进程 (electron-main)
│   ├── preload/           # 预加载脚本 (@repo/electron-preload)
│   ├── web/               # 渲染进程 - Vue 3 应用 (electron-web)
│   └── docs/              # 文档站点 (VitePress)
├── packages/
│   ├── backend-api/       # 后端 API 客户端 (@roxy/backend-api)
│   ├── shared-types/      # 共享 TypeScript 类型 (@repo/shared-types)
│   └── vite-plugin/       # 自定义 Vite 插件 (@repo/vite-plugin)
├── scripts/
│   └── watch.ts           # 开发编排脚本
├── turbo.json             # Turborepo 配置
└── pnpm-workspace.yaml    # pnpm 工作区配置
```

### 依赖关系图

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

packages/shared-types (@repo/shared-types)   # 基础类型定义包
packages/vite-plugin (@repo/vite-plugin)     # 独立插件，代码混淆 + 压缩
```

## 环境要求

- **Node.js** >= 22.20.0
- **pnpm** >= 10.18.3

> **提示：** 本项目使用 [Volta](https://volta.sh/) 管理 Node.js 和 pnpm 版本。如果你已安装 Volta，将自动使用正确的版本。

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/buqiyuan/electron-vite-monorepo.git
cd electron-vite-monorepo
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发模式

```bash
pnpm dev
```

这将会：
1. 启动渲染进程（Web）的 Vite 开发服务器
2. 构建并监听预加载脚本的变化
3. 构建并监听主进程的变化，然后启动 Electron（带 `--inspect` 调试标志）

### 🇨🇳 中国用户加速指南

如果你在中国大陆，建议使用**淘宝 npm 镜像源**来加速依赖下载。

#### 方式一：修改 `.npmrc` 文件

取消 `.npmrc` 文件中以下行的注释：

```ini
registry = https://registry.npmmirror.com
```

#### 方式二：配置 Electron 镜像

Electron 二进制文件下载较慢时，可以配置 Electron 淘宝镜像：

```bash
pnpm config set electron_mirror "https://npmmirror.com/mirrors/electron/"
```

#### 方式三：设置环境变量

你也可以通过设置环境变量来配置所有镜像：

```bash
# Electron 二进制文件镜像
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/

# Electron Builder 二进制文件镜像
export ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
```

Windows 用户可以使用：

```powershell
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
$env:ELECTRON_BUILDER_BINARIES_MIRROR = "https://npmmirror.com/mirrors/electron-builder-binaries/"
```

> **提示：** 以上配置也可以直接写入项目根目录的 `.npmrc` 文件中，取消对应行的注释即可。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 以开发模式启动所有应用（支持 HMR 热更新） |
| `pnpm build` | 通过 Turborepo 构建所有包和应用 |
| `pnpm pack:dev` | 构建并打包 Electron 应用（开发环境） |
| `pnpm pack:prod` | 构建并打包 Electron 应用（生产环境） |
| `pnpm lint` | 在所有包中运行 ESLint 检查 |
| `pnpm lint:fix` | 自动修复 ESLint 问题 |
| `pnpm clean:cache` | 清除构建缓存 |
| `pnpm clean:lib` | 删除所有 `node_modules` 目录 |
| `pnpm reinstall` | 清除锁文件并重新安装所有依赖 |

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 桌面框架 | Electron 40 |
| 前端框架 | Vue 3 |
| 构建工具 | Vite 7 |
| 编程语言 | TypeScript 5 |
| Monorepo | pnpm Workspaces + Turborepo |
| 代码规范 | ESLint（使用 @antfu/eslint-config） |
| 应用打包 | electron-builder |
| 自动更新 | electron-updater |

## 许可证

[MIT](./LICENSE)

## 作者

[buqiyuan](https://github.com/buqiyuan)
