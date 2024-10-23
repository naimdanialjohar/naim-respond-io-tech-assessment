<script setup lang="ts">
import { ref } from 'vue'

type Props = {
  value: string
}

const props = defineProps<Props>()
const value = ref(props.value)
</script>

<template>
  <v-text-field v-model="value"></v-text-field>
</template>
