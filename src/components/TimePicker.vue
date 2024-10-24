<script setup lang="ts">
import { useNodeStore } from '@/stores/node'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

type Props = {
  label: string
  time: string
  day: string
  fieldKey: string
}

const { updateTime, activeNode } = useNodeStore()

const props = defineProps<Props>()
const time = ref(props.time)
const modal = ref(false)

watch(time, () => {
  console.log('time updates', time)
  updateTime(activeNode?.id as string, props.day, time.value, props.fieldKey)
})
</script>

<template>
  <v-text-field
    v-model="time"
    :active="modal"
    :focused="modal"
    append-icon="mdi-clock-time-four-outline"
    :label="props.label"
  >
    <v-dialog v-model="modal" activator="parent" width="auto">
      <v-time-picker v-if="modal" v-model="time"></v-time-picker>
    </v-dialog>
  </v-text-field>
</template>
