import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Configuration, OpenAIApi } from 'openai'
import App from './App.vue'
import router from './router'

import './app.less'

// Vant 桌面端适配
import '@vant/touch-emulator'

/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

const configuration = new Configuration({
  apiKey: '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',
})

const openai = new OpenAIApi(configuration)

async function exec() {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: 'Hello world',
  }, {
    timeout: 20000,
  })

  // eslint-disable-next-line no-console
  console.log(completion.data.choices[0].text)
}

exec()

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app
  .use(router)
  .use(pinia)

app.mount('#app')
