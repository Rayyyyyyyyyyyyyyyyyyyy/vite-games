<script setup lang="ts">
import { DArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import RouterNames from '@/router/name.ts'

type stateType = {
  drawerVisible: boolean
}

const state = reactive({
  drawerVisible: false
}) as stateType
const openDraw = () => {
  state.drawerVisible = true
}
const router = useRouter()
const goSudokuPage = () => {
  router.push({
    name: RouterNames.sudoku
  })
  state.drawerVisible = !state.drawerVisible
}
</script>

<template lang="pug">
.header
    el-icon.menu-icon(@click="openDraw")
        DArrowRight

    el-drawer.game-draw(
        v-model="state.drawerVisible"
        title=""
        direction="ltr"
    )
      el-image(
          src="src/assets/gifs/sudoku.gif"
          fit="contain"
          @click="goSudokuPage"
          )

</template>

<style lang="scss" scoped>
.header {
  @apply bg-text-light h-10 w-full;
  @apply flex items-center px-6;

  .menu-icon {
    @apply cursor-pointer text-primary-dark;

    &:hover {
      @apply text-primary-light;
    }
  }
  .game-draw {
    .el-image {
      @apply cursor-pointer w-20 h-20;
    }
  }
}
</style>
