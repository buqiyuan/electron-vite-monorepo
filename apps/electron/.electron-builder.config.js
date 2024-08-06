const fs = require("fs");
const path = require("path");

const version = process.env.npm_package_version
console.log('版本号：', version)

fs.cpSync(path.join(__dirname, '../web/dist'), './dist/web', { overwrite: true, recursive: true });
fs.cpSync(path.join(__dirname, '../preload/dist'), './dist/preload', { overwrite: true, recursive: true });

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: "out",
    buildResources: "buildResources",
  },
  files: [
    "dist/**",
  ],
  extraMetadata: {
    version,
  },
  mac: {
    sign: false,
    "target": [
      "dmg",
      "zip"
    ],
  },
  publish: [
    {
      "provider": "generic",
      "url": "https://lumibrowser.oss-cn-shenzhen.aliyuncs.com/public/package/app/Windows/64"
    }
  ]
};

module.exports = config;
