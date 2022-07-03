# vite-vue3-admin

> Reconstructing the entire front-end and back-end projects based on vite2.x, improving the fine-grained control of back-end permissions, and encapsulating more scene-based components... in progress

Background management system template based on vite2.x + vue3.x + antd-design-vue3.x + typescript4.x

- Account: rootadmin, password: 123456
- Online preview ( [gitee](http://buqiyuan.gitee.io/vite-vue3-admin/) / [vercel](https://vite-vue3-admin.vercel.app/) )
- [swagger documentation](https://nest-api.buqiyuan.site/api/swagger-api/static/index.html#/)
- [Background address](https://github.com/buqiyuan/nest-admin)
- [react version coding](https://github.com/buqiyuan/react-antd-admin)
- [vue-cli](https://github.com/buqiyuan/vite-vue3-admin)
- [gitee address](https://gitee.com/buqiyuan/vite-vue3-admin)
- A tool to generate typescript from JSON: [http://json2ts.com/](http://json2ts.com/)

Some designs refer to [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)

## Install and use

- Get project code

```bash
git clone https://github.com/buqiyuan/vite-vue3-admin
```

- install dependencies

```bash
cd vite-vue3-admin

pnpm install

```

- run

```bash
pnpm serve
```

- Bale

```bash
pnpm build
```

##vscode configuration

Install the plugin recommended by .vscode in the project root directory, then install Volar, disable Vetur, and restart vscode.

> Using Vue3.x family bucket, ant-design-vue3.x and typescript4.x to practice the new features and gameplay of vue3.x, I have to say that the Composition API of vue3.x is more flexible than the Options API of vue2.x Many, allowing us to flexibly combine component logic, we can easily use the form of hooks to replace the previous writing methods such as mixins. For more hooks, please refer to [vueuse](https://vueuse.org/functions.html)

## Project brief description

`rootadmin` enables multi-sign-on by default, and other newly created accounts are single-sign-on by default. It is recommended to pull the back-end code to run locally to avoid conflicts and misunderstandings when multiple people operate at the same time.

### todolist

- [x] Dynamic form (in progress)
- [x] Dynamic form (in progress)
- [ ] E-commerce SKU function demo
- [ ] Pure front-end export PDF dynamic pagination
- [ ] other...

## Git contribution commit specification

- Refer to [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) specification([Angular](https://github.com/conventional-changelog/conventional-changelog /tree/master/packages/conventional-changelog-angular))

  - `feat` adds new features
  - `fix` fixes issues/bugs
  - `style` code style has no effect on the running result
  - `perf` optimizations/performance improvements
  - `refactor` refactoring
  - `revert` to undo changes
  - `test` test related
  - `docs` documentation/comments
  - `chore` dependency update/scaffold configuration modification etc.
  - `workflow` workflow improvements
  - `ci` continuous integration
  - `types` type definition file changes
  - `wip` in development

### QQ exchange group (2022-3-8)

[![Join QQ group](https://img.shields.io/badge/570108996-blue.svg)](https://qm.qq.com/cgi-bin/qm/qr?k=ID- KcAOdPUPWVgAnsPLF3gRdHLc8GURO&jump_from=webapi)

<div><img src="https://cdn.jsdelivr.net/gh/buqiyuan/MyImageHosting/imgs/vue3-antdv-admin/qq_group.jpg" height="280" /></div>

## Appreciate

If you find this project helpful, you can buy the author a cup of coffee to show your support!

| WeChat | Alipay |
| :-: | :-: |
| <img src="https://cdn.jsdelivr.net/gh/buqiyuan/MyImageHosting/imgs/vue3-antdv-admin/weixin.jpg" height="220" /> | <img src="https:/ /cdn.jsdelivr.net/gh/buqiyuan/MyImageHosting/imgs/vue3-antdv-admin/zhifubao.jpg" height="220" /> |

## Thanks to JetBrains for free open source license

<a href="https://www.jetbrains.com/?from=Mybatis-PageHelper" target="_blank">
<img src="https://user-images.githubusercontent.com/1787798/69898077-4f4e3d00-138f-11ea-81f9-96fb7c49da89.png" height="200"/></a>
