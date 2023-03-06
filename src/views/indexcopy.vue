<script setup lang="ts">
import { generate } from '../api/index'

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const messae = ref('')
const context = ref('')
const price = ref(0)
const finisText = ref('没有更多消息')

const onLoad = () => {
  // 加载状态结束
  loading.value = false
  finished.value = true
}

const generateDesc = async (content: any) => {
  finisText.value = '此时一位工作人员正在疯狂码字...'
  const res = await generate(content)
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

  const hasText = resu.trim()

  // 将历史上下文传递给模型，生成响应
  if (hasText)
    context.value = `${context.value}\n${hasText}`

  price.value += res.data.usage.total_tokens

  // 如果要加下面这行代码，注意ai无内容返回时的判断逻辑
  // <div class="token">本组对话消耗：￥${((res.data.usage.prompt_tokens + res.data.usage.completion_tokens) * 70 * 0.0000026).toFixed(5)}</div>

  list.value.push({
    text: hasText || '抱歉！突然不知道怎么回答你的问题了。',
    label: 'ai',
  })
}

const addMessage = () => {
  if (messae.value === '')
    return

  list.value.push({
    text: messae.value,
    label: 'you',
  })

  if (context.value.length !== 0)
    context.value = `${context.value}\n ${messae.value}`
  else
    context.value = `你是一名智能客服，用来回答用户提的问题。以下是提供的上下文，请分析后进行回答： \n ${messae.value}`

  // 触发openai回复
  generateDesc(context.value)

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
      <!-- <div class="price">
        本次会话总共消耗：￥{{ (price * 70 * 0.0000026).toFixed(5) }}
      </div> -->
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
  // padding: 10px 0;

  .price {
    font-size: 12px;
    color: #c8c7c7;
    margin-left: 20px;
    margin-bottom: 10px;
  }
}
</style>
