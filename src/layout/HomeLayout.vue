<script setup lang="ts">
import { useRouter } from 'vue-router'
import RouterNames from '@/router/name.ts'

const router = useRouter()

onMounted(() => {
  router.push({
    name: RouterNames.home
  })
})
</script>

<template lang="pug">
router-view
</template>

<style lang="scss" scoped></style>
