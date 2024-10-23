<script setup lang="ts">
import { ref } from 'vue'

type Props = {
  label: string
  time: string
}

const props = defineProps<Props>()
const time = ref(props.time)
const modal = ref(false)
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
