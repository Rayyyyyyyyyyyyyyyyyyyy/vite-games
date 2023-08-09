<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'

const defaultSudoku = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9']
]

const state = reactive({
  testAns: [],
  showTime: false,
  gameTime: '00:00:00'
})
onMounted(() => {
  state.testAns = defaultSudoku
})
let totalSeconds = 0
let interval

const clickAnsBox = (rowIdx: number, colIdx: number) => {
  console.log('rowIdx', rowIdx) // 橫的
  console.log('colIdx', colIdx) // 直的
}

const getStartGame = (isStart: boolean) => {
  state.showTime = isStart
  clearInterval(interval)
  totalSeconds = 0
  state.gameTime = '00:00:00'
  if (isStart) {
    interval = setInterval(updateTimer, 1000)
  }
}
const updateTimer = () => {
  totalSeconds++
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  state.gameTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(
    seconds
  )}`
}
const formatTime = (time: number) => {
  return time < 10 ? `0${time}` : time
}

onBeforeRouteLeave(() => {
  clearInterval(interval)
})
</script>

<template lang="pug">
.container
    .time-clock
        p(v-if="state.showTime") {{ state.gameTime }}
    .border-box
        .sudoku-row(
            v-for="(it, idx) in state.testAns"
            :class="{'solid border-b-2': [2, 5].includes(idx), 'dashed border-b': ![2, 5].includes(idx) && idx != 8}"
            )
            .sudoku-col
                .item(
                    v-for="(item, index) in it"
                    :class="{'solid border-l-2': [3, 6].includes(index), 'dashed border-l': ![3, 6].includes(index) && index != 0, 'cursor-pointer': item == '.'}"
                    @click="clickAnsBox(idx + 1, index + 1)"
                    ) {{ item == '.' ? '' : item }}

    .num-row
        .num-box(v-for="ind in 9") {{ ind }}



    .flex-center.mt-10
      el-button(type="primary" @click="getStartGame(true)") Start
      el-button(type="info" @click="getStartGame(false)") Finish
      el-button(type="info" plain) Reset

</template>

<style lang="scss" scoped>
.container {
  @apply flex flex-col justify-center items-center;

  .time-clock {
    @apply h-10;
  }

  .border-box {
    @apply border-2 border-secondary;
    @apply rounded flex flex-col;
    width: 594px;
    height: 594px;
  }
  .sudoku-row {
    @apply flex-1;
  }
  .sudoku-col {
    @apply flex items-center justify-center w-full h-full;
  }

  .item {
    @apply flex-1 h-full;
    @apply flex items-center justify-center;

    &:hover {
      @apply bg-primary-light text-white;
    }
  }

  .solid {
    @apply border-solid;
  }
  .dashed {
    @apply border-dashed;
  }

  .num-row {
    @apply flex items-center justify-between;
    @apply mt-10 w-2/4 mx-auto;
  }
  .num-box {
    @apply text-center p-2;
    @apply border w-10 h-10 rounded;
    @apply bg-primary-light text-white cursor-pointer;

    &:hover {
      @apply bg-primary;
    }
  }
}
</style>
