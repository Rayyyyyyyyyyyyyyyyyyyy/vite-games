<script setup lang="ts">
import { useRouter } from 'vue-router'
import RouterNames from '@/router/name.ts'

const router = useRouter()
onMounted(() => {
  router.push({
    name: RouterNames.sudoku
  })
})
</script>

<template lang="pug">
.container
  Header
  router-view
</template>

<style lang="scss" scoped></style>
