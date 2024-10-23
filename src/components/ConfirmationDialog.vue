<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(false)

type Props = {
  title: string
  buttonText: string
  onApprove: any
  onApproveText: string
}

const onClickApprove = () => {
  dialog.value = false
  props.onApprove()
}

const props = defineProps<Props>()
</script>
<template>
  <div>
    <v-dialog v-model="dialog" max-width="400">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" size="small" class="no-padding"
          >{{ props.buttonText }}
        </v-btn>
      </template>

      <v-card prepend-icon="mdi-map-marker" :title="props.title">
        <div class="tw-py-4 tw-px-6">
          <slot></slot>
        </div>
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="dialog = false">Cancel</v-btn>

          <v-btn @click="onClickApprove">{{ props.onApproveText }}</v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
