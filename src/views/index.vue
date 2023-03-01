<script setup lang="ts">
// import { Configuration, OpenAIApi } from 'openai'
import { generate } from '../api/index'

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const messae = ref('')
const finisText = ref('没有更多消息')

const onLoad = () => {
  // 加载状态结束
  loading.value = false
  finished.value = true
}

const generateDesc = async (messae: any) => {
  finisText.value = '此时一位工作人员正在疯狂码字...'
  const res = await generate(messae)
  finisText.value = '没有更多消息'
  let resu = ''
  const arr = ['？', '，', '；', '！', '?', ',', ';', '!', '。', '.']
  if (arr.includes(res.data.choices[0].text.charAt(0)))
    resu = res.data.choices[0].text.substr(1)
  else
    resu = res.data.choices[0].text

  if (resu.substring(0, 4) === '\n\n')
    resu = resu.replace('\n\n', '')

  if (resu.indexOf('↵↵') !== 0)
    resu = resu.replace('↵↵', '')

  list.value.push({
    text: resu.trim(),
    label: 'ai',
  })
  // const configuration = new Configuration({
  //   apiKey: process.env.VUE_APP_OPENAI_API_KEY,
  // })

  // const openai = new OpenAIApi(configuration)

  // const completion = await openai.createCompletion({
  //   model: 'text-davinci-003',
  //   prompt: messae,
  //   stream: false,
  //   temperature: 0.7,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,
  //   max_tokens: 500,
  //   n: 1,
  // })
  // console.log(messae)

  // console.log(completion.data.choices[0].text)
}

const addMessage = () => {
  list.value.push({
    text: messae.value,
    label: 'you',
  })

  // 触发openai回复
  generateDesc(messae.value)

  messae.value = ''
}
</script>

<template>
  <div class="container">
    <van-nav-bar title="罗德与施瓦茨智能客服" fixed />

    <van-sticky :offset-top="50">
      <van-notice-bar
        left-icon="volume-o"
        text="正在与您对话的是人工智能，回复的内容仅供参考。此外，您描述的问题越清楚准确，给您的回复越精确。"
      />
    </van-sticky>

    <div class="chat-wrap">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="finisText"
        @load="onLoad"
      >
        <template v-for="item in list" :key="item">
          <chat-item :item="item" />
        </template>
      </van-list>
    </div>

    <div class="footer">
      <van-cell-group inset>
        <van-field
          v-model="messae"
          rows="1"
          placeholder="亲，请输入您的问题"
        >
          <template #button>
            <van-button size="small" type="primary" @click="addMessage">
              发送
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  padding-top: 45px;
  position: relative;
  background: #f6f6f6;
}

.chat-wrap {
  width: 100%;
  height: 80vh;
  overflow:auto;
  padding-bottom: 20px;
}

.footer {
  width: 100%;
  min-height: 60px;
  background: #f6f6f6;
  position: fixed;
  bottom: 0;
}
</style>
