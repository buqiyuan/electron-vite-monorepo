import { writeFileSync } from "node:fs";
import path from "node:path";
import { generateApi } from "swagger-typescript-api";

/* NOTE: all fields are optional expect one of `input`, `url`, `spec` */
generateApi({
  output: path.resolve(process.cwd(), "./src/api"),
  url: "http://127.0.0.1:4523/export/openapi/11?version=3.0",
  httpClientType: "axios", // or "fetch"
  modular: true,
  //  generateRouteTypes: true,
  moduleNameFirstTag: true,
  extractRequestParams: true,
  extractRequestBody: true,
  extractResponseError: true,
  extractResponseBody: true,
  extractEnums: true,
  unwrapResponseData: true,
  cleanOutput: true,
  singleHttpClient: true,
  generateResponses: true,
  hooks: {
    onCreateRoute(routeData) {
      routeData.namespace = `${routeData.namespace}API`;
      return routeData;
    },
  },
}).then(({ files }) => {
  const content = files.reduce((acc, file) => {
    return `${acc}
export * from './${file.fileName}'`;
  }, "");
  // 生成统一导出文件
  writeFileSync("./src/api/index.ts", content);
});
