<script lang="ts" setup>
import type { NodeProps } from '@vue-flow/core'

type Props = {
  node: NodeProps
}

const props = defineProps<Props>()

const convertCamelCaseToTitleCase = (text: string) => {
  // Use a regex to insert a space before each uppercase letter
  const result = text.replace(/([A-Z])/g, ' $1')

  return result.replace(/^./, text[0].toUpperCase()) // Capitalize first letter
}
</script>

<template>
  <div
    class="tw-min-w-52 tw-bg-white tw-border-solid tw-border-gray-300 tw-border-[1px] tw-rounded-xl"
  >
    <div class="tw-p-3">
      <v-icon icon="mdi-calendar" color="#C1175A" class="tw-mr-2" />
      <span class="tw-capitalize tw-font-semibold tw-text-base">
        {{ props.node.data.label }}
      </span>
    </div>
    <v-divider :thickness="1" class="tw-border-gray-700" />
    <div class="tw-p-3 tw-text-sm">
      {{ convertCamelCaseToTitleCase(props.node.data.action) }} -
      {{ props.node.data.timezone }}
    </div>
  </div>
  <!-- <Handle
    :position="props.type === 'source' ? Position.Bottom : Position.Top"
  /> -->
</template>

<style>
.custom-node {
  @apply tw-bg-slate-500;
  min-width: 100px;
  gap: 4px;
  padding: 8px;
  background: white;
  border: 1px solid black;
  border-radius: 4px;
}

.increment {
  border-radius: 4px;
  background: #42b983;
  font-size: 10px;
  color: #fff;
  cursor: pointer;
  border: none;
}

.increment:hover {
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.counter {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
}

.count {
  font-size: 6px;
  color: #ff0072;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}
</style>
