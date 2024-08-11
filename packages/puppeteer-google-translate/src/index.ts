import { GoogleTranslator } from './google-translator';

(async () => {
  const googleTranslator = new GoogleTranslator()

  googleTranslator.translateText('hello world!', 'auto', 'zh-CN')
})()
