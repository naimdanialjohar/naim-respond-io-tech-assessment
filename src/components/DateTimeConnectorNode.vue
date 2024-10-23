<script lang="ts" setup>
import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  type HandleType,
} from '@vue-flow/core'
import type { MaybeRefOrGetter } from 'vue'

type Props = {
  type: MaybeRefOrGetter<HandleType>
}

const props = defineProps<Props>()

const connections = useHandleConnections({
  type: props.type,
})

const nodesData = useNodesData(() => connections.value[0]?.source)
</script>

<template>
  <div
    class="tw-bg-[#E1EBFF] tw-text-blue-600 tw-font-semibold tw-border-solid tw-border-[#E1EBFF] tw-border-[1px] tw-rounded-xl tw-text-xs"
  >
    <div class="tw-p-2">{{ nodesData?.data.label }}</div>
  </div>
  <!-- <Handle
    :position="props.type === 'source' ? Position.Bottom : Position.Top"
  /> -->
</template>
