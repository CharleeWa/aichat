<script setup>
import { number } from 'echarts'

const props = defineProps({
  item: number,
})

// onMounted(() => {
//   // eslint-disable-next-line no-console
//   console.log(props.item)
// })
</script>

<template>
  <!-- <van-cell :title="props.item" /> -->
  <div v-if="item.label === 'you'" class="chat-card">
    <div class="card">
      {{ item.text }}
    </div>
    <div class="id">
      You
    </div>
  </div>

  <div v-if="item.label === 'ai'" class="chat-card2">
    <div class="id">
      AI
    </div>
    <div class="card">
      {{ item.text }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.chat-card {
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
  padding: 10px;

  .card {
    max-width: 80%;
    margin-right: 10px;
    border-radius: 10px;
    padding: 10px;
    background: #fff;
  }
}

.chat-card2 {
  min-height: 30px;
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding: 10px;

  .card {
    max-width: 80%;
    margin-left: 10px;
    border-radius: 10px;
    padding: 10px;
    background: #fff;
  }
}
</style>
