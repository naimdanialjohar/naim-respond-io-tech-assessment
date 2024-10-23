<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : 'right'"
        :width="750"
        temporary
        class="tw-p-5"
      >
        <!-- type sendMessage -->
        <template v-if="!!drawer">
          <!-- check to see if template is allowed to be used this way -->
          <template v-if="!!nodeStore.activeNode">
            <!-- for dateTime node types -->
            <template v-if="nodeStore.activeNode.type === 'dateTime'">
              <DrawerHeader
                :activeNode="nodeStore.activeNode"
                icon="mdi-calendar"
                iconColor="#FF561E"
              >
                <div class="tw-flex tw-gap-3">
                  <v-btn
                    @click="drawer = !drawer"
                    size="small"
                    class="no-padding"
                    >Close</v-btn
                  >
                  <ConfirmationDialog
                    title="Remove node"
                    buttonText="Remove node"
                    :onApprove="() => onRemoveNode(nodeStore.activeNode!.id)"
                    onApproveText="Remove"
                    >{{ 'Are you sure you want to remove this node?' }}
                  </ConfirmationDialog>
                </div>
              </DrawerHeader>
              <v-row
                v-for="(time, index) in nodeStore.activeNode.data.times"
                :key="index"
              >
                <v-col cols="6">
                  <TimePicker label="Start Time" :time="time.startTime" />
                </v-col>

                <v-col cols="6">
                  <TimePicker label="End Time" :time="time.endTime" />
                </v-col>
              </v-row>
            </template>

            <!-- for sendMessage node types -->
            <template v-if="nodeStore.activeNode.type === 'sendMessage'">
              <DrawerHeader
                :activeNode="nodeStore.activeNode"
                icon="mdi-send-circle-outline"
                iconColor="#3BACA1"
              />
              <v-row
                v-for="(node, index) in nodeStore.activeNode.data.payload"
                :key="index"
              >
                <v-text-field v-if="node.type === 'text'" :value="node.text" />
                <v-col v-if="node.type === 'attachment'" cols="4">
                  <v-img aspectRatio="16/9" :src="node.attachment"></v-img>
                  <v-file-input accept="image/*"></v-file-input>
                </v-col>
              </v-row>
            </template>
          </template>
        </template>
      </v-navigation-drawer>

      <v-main style="height: 100vh">
        <slot></slot>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
import { useNodeStore } from '@/stores/node'
import TimePicker from './TimePicker.vue'
import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import TextInput from './TextInput.vue'
import DrawerHeader from './DrawerHeader.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'

const { removeNodes } = useVueFlow()
const nodeStore = useNodeStore()
const drawer = ref(false)

watch(
  () => nodeStore.activeNode,
  newVal => {
    // if (nodeStore.activeNode) {
    console.log('LALAALAL triggered:', newVal)
    drawer.value = !!newVal
    // }
  },
)

watch(drawer, () => {
  if (!drawer.value) {
    console.log('its closing??')
    nodeStore.setActiveNode(undefined)
  }
})

// remove node, and close drawer
// pair with confirmation dialog
const onRemoveNode = (id: string) => {
  removeNodes(id)
  nodeStore.setActiveNode(undefined)
}
</script>
