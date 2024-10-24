<script setup lang="ts">
import { useNodeStore } from '@/stores/node'
import type { Node } from '@vue-flow/core'
import { ref } from 'vue'
import ConfirmationDialog from './ConfirmationDialog.vue'

type Props = {
  activeNode: Node
  icon: string
  iconColor: string
  removeNodeFunction: (id: string) => void
  closeDrawerFunction: () => void
}

const props = defineProps<Props>()
const nodeStore = useNodeStore()
const titleRef = ref(props.activeNode.data.label)
const nodeId = props.activeNode.id

const handleUpdate = () => {
  nodeStore.updateTitle(nodeId, titleRef.value)
}
</script>
<template>
  <v-row no-gutters class="tw-items-center tw-justify-between">
    <div class="tw-flex tw-items-center tw-w-full">
      <v-icon :icon="props.icon" :color="props.iconColor" class="tw-mr-2" />
      <v-text-field v-model="titleRef" full-width @input="handleUpdate" />
    </div>
    <!-- <slot></slot> -->
    <div class="tw-flex tw-gap-3">
      <v-btn @click="props.closeDrawerFunction" size="small" class="no-padding"
        >Close</v-btn
      >
      <ConfirmationDialog
        title="Remove node"
        buttonText="Remove node"
        :onApprove="() => props.removeNodeFunction(nodeStore.activeNode!.id)"
        onApproveText="Remove"
        >{{ 'Are you sure you want to remove this node?' }}
      </ConfirmationDialog>
    </div>
  </v-row>
  <v-divider :thickness="1" class="tw-my-5 tw-border-gray-700"></v-divider>
</template>
