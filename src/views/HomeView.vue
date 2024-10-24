<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const onClickEnter = () => router.push({ path: '/flow_chart' })
</script>

<template>
  <div class="tw-flex tw-h-[100vh] tw-justify-center tw-items-center">
    <v-btn @click="onClickEnter">Enter</v-btn>
  </div>
</template>
