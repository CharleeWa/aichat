<script setup lang="ts">
import { showToast } from 'vant'
import { generate, generateEmbeddings, generateFineTunes } from '../api/index'

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const messae = ref('')
const showPopover = ref(false)
const model = ref('ChatGPT')

const context = ref([
  {
    role: 'system',
    content: '你是一个很有用的客服。',
  },
])

// const price = ref(0)
const finisText = ref('没有更多消息')

const onLoad = () => {
  // 加载状态结束
  loading.value = false
  finished.value = true
}

// 通过 actions 属性来定义菜单选项
const actions = [
  { text: 'ChatGPT' },
  { text: 'Embeddings' },
  { text: 'Finetunes' },
]

const onSelect = (action) => {
  model.value = action.text
  showToast(`已切换为: ${action.text}`)
}

const onClickRight = () => showPopover.value = true

const generateDesc = async (content: any) => {
  context.value.push({
    role: 'user',
    content,
  })

  finisText.value = '此时一位工作人员正在疯狂码字...'
  const res = await generate(context.value)
  finisText.value = '没有更多消息'

  context.value.push({
    role: 'assistant',
    content: res.data.choices[0].message.content,
  })

  list.value.push({
    text: res.data.choices[0].message.content,
    label: 'ai',
  })
}

const embeddings = async (content: any) => {
  finisText.value = '此时一位工作人员正在疯狂码字...'
  const res = await generateEmbeddings(content)
  finisText.value = '没有更多消息'

  list.value.push({
    text: res.data.text,
    label: 'ai',
  })
}

const finetunes = async (content: any) => {
  finisText.value = '此时一位工作人员正在疯狂码字...'
  const res = await generateFineTunes(content)
  finisText.value = '没有更多消息'

  list.value.push({
    text: res.data.text,
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

  // 触发ChatGPT回复
  if (model.value === 'ChatGPT')
    generateDesc(messae.value)
  else if (model.value === 'Embeddings')
    embeddings(messae.value)
  else if (model.value === 'Finetunes')
    finetunes(messae.value)

  messae.value = ''
}
</script>

<template>
  <div class="container">
    <van-nav-bar title="AI客服" fixed @click-right="onClickRight">
      <template #right>
        <van-popover v-model:show="showPopover" :actions="actions" placement="bottom-end" @select="onSelect">
          <template #reference>
            <van-icon name="weapp-nav" size="32" />
          </template>
        </van-popover>
      </template>
    </van-nav-bar>

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
