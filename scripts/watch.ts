#!/usr/bin/env node

import { build, createServer, } from 'vite';
import type { LogLevel, ViteDevServer } from 'vite';
import electronPath from 'electron';
import { ChildProcess, spawn } from 'node:child_process';
import path from 'node:path';
import { generateAsync } from '@repo/dts-for-context-bridge'


/** @type 'production' | 'development'' */
const mode = (process.env.MODE = process.env.MODE || 'development');

const logLevel: LogLevel = 'warn';

/**
 * 设置`main`包的监听器
 * 当文件发生变化时，完全重新启动electron应用程序。
 * @param {import('vite').ViteDevServer} watchServer 渲染器监听服务器实例。
 * 需要从{@link import('vite').ViteDevServer.resolvedUrls}设置`VITE_DEV_SERVER_URL`环境变量。
 */
function setupMainPackageWatcher({ resolvedUrls }: ViteDevServer) {
  process.env.VITE_DEV_SERVER_URL = resolvedUrls.local[0];

  let electronApp: ChildProcess | null = null;

  return build({
    mode,
    logLevel,
    configFile: 'apps/electron/vite.config.ts',
    build: {
      /**
       * 设置为{}以启用rollup监听器
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
    plugins: [
      {
        name: 'reload-app-on-main-package-change',
        writeBundle() {
          /** 如果进程已存在，则杀死electron */
          if (electronApp !== null) {
            electronApp.removeListener('exit', process.exit);
            electronApp.kill('SIGINT');
            electronApp = null;
          }

          console.log('Reloading electron app...', String(electronPath));
          /** 启动新的electron进程 */
          electronApp = spawn(String(electronPath), ['--inspect', '.'], {
            stdio: 'inherit',
            // 设置工作目录
            cwd: path.resolve(__dirname, '../apps/electron'),
          });

          /** 当应用程序退出时停止监听脚本 */
          electronApp.addListener('exit', process.exit);
        },
      },
    ],
  });
}

/**
 * 设置`preload`包的监听器
 * 当文件发生变化时，重新加载网页。
 * @param {import('vite').ViteDevServer} watchServer 渲染器监听服务器实例。
 * 需要访问页面的web socket。通过向socket发送`full-reload`命令，重新加载网页。
 */
function setupPreloadPackageWatcher({ ws }: ViteDevServer) {
  return build({
    mode,
    logLevel,
    configFile: 'apps/preload/vite.config.ts',
    build: {
      /**
       * 设置为{}以启用rollup监听器
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
    plugins: [
      {
        name: 'reload-page-on-preload-package-change',
        writeBundle() {
          // Generating exposedInMainWorld.d.ts when preload package is changed.
          generateAsync({
            input: "apps/preload/src/**/*.ts",
            output: "apps/preload/exposedInMainWorld.d.ts",
          });

          ws.send({
            type: 'full-reload',
          });
        },
      },
    ],
  });
}

/**
 * 渲染器包的开发服务器 必须是第一个启动，
 * 因为{@link setupMainPackageWatcher}和{@link setupPreloadPackageWatcher}
 * 依赖于开发服务器的属性
 */
(async () => {
  const rendererWatchServer = await createServer({
    mode,
    logLevel,
    configFile: 'apps/web/vite.config.ts',
  }).then(s => s.listen());

  await setupPreloadPackageWatcher(rendererWatchServer);
  await setupMainPackageWatcher(rendererWatchServer);

})();
