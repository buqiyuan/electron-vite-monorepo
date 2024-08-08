import { build, Configuration, Platform } from "electron-builder";
import { cpSync } from "node:fs";
import { exit, platform } from "node:process";
import path from "node:path";

const version = process.env.npm_package_version;
console.log("版本号：", version);

const workDir = path.join(__dirname, "../");

cpSync(path.join(workDir, "../web/dist"), path.join(workDir, "./dist/web"), {
  recursive: true,
});
cpSync(
  path.join(workDir, "../preload/dist"),
  path.join(workDir, "./dist/preload"),
  { recursive: true },
);

const options: Configuration = {
  // appId: "com.linkv.electron",
  productName: 'ElectronViteMonorepo',
  asar: true,
  directories: {
    output: "out",
    buildResources: "buildResources",
  },
  files: ["dist"],
  protocols: {
    name: "Deeplink Example",
    // Don't forget to set `MimeType: "x-scheme-handler/deeplink"` for `linux.desktop` entry!
    schemes: ["deeplink"],
  },

  // "store” | “normal” | "maximum". - For testing builds, use 'store' to reduce build time significantly.
  compression: "normal",
  removePackageScripts: true,

  afterSign: async (context) => {
    // Mac releases require hardening+notarization: https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution
    if (context.electronPlatformName === "darwin") {
      // await notarizeMac(context)
    }
  },
  nodeGypRebuild: false,
  buildDependenciesFromSource: false,

  win: {
    target: "nsis",
  },

  mac: {
    target: ["dmg", "zip"],
    entitlements: "buildResources/entitlements.mac.plist",
    entitlementsInherit: "buildResources/entitlements.mac.plist",
    identity: "LINKV TECH PTE. LTD. (GLM223L5MF)",
    hardenedRuntime: true,
    gatekeeperAssess: true,
  },

  linux: {
    desktop: {
      StartupNotify: "false",
      Encoding: "UTF-8",
      MimeType: "x-scheme-handler/deeplink",
    },
    target: ["AppImage", "rpm", "deb"],
  },
  publish: [
    {
      provider: 'github',
      releaseType: 'draft',
    }
  ]
};

// 要打包的目标平台
const targetPlatform: Platform = {
  darwin: Platform.MAC,
  win32: Platform.WINDOWS,
  linux: Platform.LINUX
}[platform];

build({
  targets: targetPlatform.createTarget(),
  config: options,
  publish: "always"
})
  .then((result) => {
    console.log(JSON.stringify(result));
    const outDir = path.join(workDir, "out");
    console.log('\x1b[32m', `打包完成🎉🎉🎉你要的都在 ${outDir} 目录里🤪🤪🤪`);
  })
  .catch((error) => {
    console.log('\x1b[31m', '打包失败，错误信息：', error);
    exit(1);
  });
