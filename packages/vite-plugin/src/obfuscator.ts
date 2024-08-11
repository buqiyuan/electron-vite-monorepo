import JavaScriptObfuscator from 'javascript-obfuscator'
import { minify } from 'terser'
import type { PluginOption } from 'vite'

export function codeObfuscator(): PluginOption {
  return [
    {
      name: 'code-obfuscator',
      enforce: 'post',
      async transform(code) {
        //  先压缩然后再进行混淆
        //  因为 import.meta.env 可能会出现引用对象的问题
        //  比如 {a:'foo',b:'bar'}.a
        //  压缩后 'foo'
        const res = await minify(code)
        const content = res.code || code

        //  在下面配置你的参数
        const obfuscationResult = JavaScriptObfuscator.obfuscate(content, {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 1,
          numbersToExpressions: true,
          simplify: true,

          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayEncoding: ['base64', 'rc4'],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 3,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 2,
          stringArrayWrappersType: 'variable',
          stringArrayThreshold: 1,

          splitStrings: true,
          unicodeEscapeSequence: true,
        })

        return obfuscationResult.getObfuscatedCode()
      },
    },
  ]
}
