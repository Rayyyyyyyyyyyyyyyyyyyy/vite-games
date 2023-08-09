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
  testAns: [] as string[][],
  showTime: false,
  gameTime: '00:00:00',

  rowIdx: -1,
  colIdx: -1
})
onMounted(() => {
  doResetSudokuGame()
  state.showTime = false
  state.gameTime = '00:00:00'
})

let totalSeconds = 0
let interval

const getStartGame = (isStart: boolean) => {
  state.showTime = isStart
  clearInterval(interval)
  totalSeconds = 0
  state.gameTime = '00:00:00'
  if (isStart) {
    interval = setInterval(updateTimer, 1000)
  } else {
    state.rowIdx = -1
    state.colIdx = -1
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

const doResetSudokuGame = () => {
  state.rowIdx = -1
  state.colIdx = -1
  state.testAns = JSON.parse(JSON.stringify(defaultSudoku))
}

const clickItemBox = (rowIdx: number, colIdx: number) => {
  if (
    state.testAns[rowIdx][colIdx] == '.' ||
    typeof state.testAns[rowIdx][colIdx] == 'number'
  ) {
    state.rowIdx = rowIdx
    state.colIdx = colIdx
  } else {
    return
  }
}
const doFillAns = (ans: number) => {
  if (state.testAns[state.rowIdx][state.colIdx] != '.') {
    if (typeof state.testAns[state.rowIdx][state.colIdx] == 'number') {
      if (state.testAns[state.rowIdx][state.colIdx] == ans) {
        state.testAns[state.rowIdx][state.colIdx] = '.'
      } else {
        state.testAns[state.rowIdx][state.colIdx] = ans
      }
    }
  } else {
    state.testAns[state.rowIdx][state.colIdx] = ans
  }
}

const checkRowIncludes = (ans: number) => {
  let rowString = state.testAns[state.rowIdx]
  console.log('rowString', rowString)
  // 橫的
  return (
    rowString.includes(ans.toString()) &&
    rowString.filter(_ => _ == ans).length > 1
  )
}
const checkColIncludes = (ans: number) => {
  // 直的
  const colStr = state.testAns.map(_ => _[state.colIdx])
  console.log('col', colStr)
  return (
    colStr.includes(ans.toString()) && colStr.filter(_ => _ == ans).length > 1
  )
}

const checkBoxIncludes = (ans: number) => {
  // 小9宮格內
  const rowStart = setStartIndex(state.rowIdx)
  const colStart = setStartIndex(state.colIdx)
  let boxAnsList
  let rowList
  state.testAns.forEach((item, index) => {
    if (index == rowStart) {
      rowList = [
        state.testAns[index],
        state.testAns[index + 1],
        state.testAns[index + 2]
      ]
    }
  })
  let boxList = []
  rowList.forEach(item => {
    boxList.push(item.slice(colStart, colStart + 3))
  })
  boxAnsList = [].concat(...boxList)
  console.log('boxAnsList', boxAnsList)
  return boxAnsList.includes(ans) && boxAnsList.filter(_ => _ == ans).length > 1
}
const setStartIndex = ind => {
  if (ind < 3) {
    return 0
  } else if (ind > 2 && ind < 6) {
    return 3
  } else {
    return 6
  }
}

const numButtonDisable = computed(() => {
  return state.rowIdx == -1 || state.colIdx == -1 || state.showTime == false
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
                    :class=`{
                            'solid border-l-2': [3, 6].includes(index),
                            'dashed border-l': ![3, 6].includes(index) && index != 0,
                            'cursor-pointer': item == '.',
                            'active-item': idx == state.rowIdx && index == state.colIdx && (item == '.' || typeof item == 'number'),
                            'error-item': idx == state.rowIdx && index == state.colIdx && (checkRowIncludes(item) || checkColIncludes(item) || checkBoxIncludes(item)) && typeof item == 'number',
                            'text-primary' : typeof item == 'number'}`
                    @click="clickItemBox(idx, index)"
                    ) {{ item == '.' ? '' : item }}

    .num-row
        el-button.num-box(
            type="primary"
            v-for="ind in 9"
            @click="doFillAns(ind)"
            :disabled="numButtonDisable"
            ) {{ ind }}



    .flex-center.mt-10
      el-button(type="primary" @click="getStartGame(true)") Start
      el-button(type="info" @click="getStartGame(false)") Finish
      el-button(type="info" :plain="true"
      @click="doResetSudokuGame") Reset

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

  .active-item {
    @apply bg-primary-light text-white;
  }
  .error-item {
    @apply bg-red text-white;
  }

  .num-row {
    @apply flex items-center justify-between;
    @apply mt-10 w-2/4 mx-auto;
  }
  .num-box {
    @apply w-10 h-10;

    &:hover {
      @apply bg-primary;
    }
  }
}
</style>
