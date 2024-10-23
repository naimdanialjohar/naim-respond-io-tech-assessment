<script lang="ts" setup>
import type { NodeProps } from '@vue-flow/core'

type Props = {
  node: NodeProps
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="tw-min-w-52 tw-bg-white tw-border-solid tw-border-gray-300 tw-border-[1px] tw-rounded-xl"
  >
    <div class="tw-p-3">
      <v-icon
        icon="mdi-lightning-bolt-outline"
        color="#C1175A"
        class="tw-mr-2"
      />
      <span class="tw-capitalize tw-font-semibold tw-text-base">
        {{ props.node.data.label }}
      </span>
    </div>
    <v-divider :thickness="1" class="tw-border-gray-700" />
    <div class="tw-p-3 tw-text-sm">
      {{ props.node.data.type }}
    </div>
  </div>
  <!-- <Handle
    :position="props.type === 'source' ? Position.Bottom : Position.Top"
  /> -->
</template>
