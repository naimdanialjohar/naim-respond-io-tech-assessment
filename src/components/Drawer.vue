<script setup lang="ts">
import { useNodeStore } from '@/stores/node'
import TimePicker from './TimePicker.vue'
import { onMounted, ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import DrawerHeader from './DrawerHeader.vue'
import { useRoute, useRouter } from 'vue-router'

type File = Event & { target: HTMLInputElement }

const { removeNodes } = useVueFlow()
const nodeStore = useNodeStore()
const route = useRoute()
const router = useRouter()
const drawer = ref(false)

// open drawer
watch(
  () => nodeStore.activeNode,
  newVal => (drawer.value = !!newVal),
)

// assign node id to store if found in url
onMounted(() => {
  if (route.query.node) nodeStore.setActiveNode(route.query.node as string)
})

// when drawer is closed, user is redirected back to flow chart page
watch(drawer, () => {
  if (!drawer.value) {
    nodeStore.setActiveNode(undefined)
    router.push({ path: '/flow_chart' })
  }
})

// remove node, and close drawer
// pair with confirmation dialog
const onRemoveNode = (id: string) => {
  removeNodes(id)
  nodeStore.setActiveNode(undefined)
}

const onFileUpload = (fileData: File) => {
  if (!fileData) {
    return
  }
  if (fileData.target.files) {
    nodeStore.updateAttachments(
      nodeStore.activeNode?.id as string,
      fileData.target.files[0],
    )
  }
}
</script>

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
        <template v-if="!!drawer">
          <!-- check to see if template is allowed to be used this way -->
          <template v-if="!!nodeStore.activeNode">
            <!-- for trigger node types -->
            <template v-if="nodeStore.activeNode.type === 'trigger'">
              <DrawerHeader
                :activeNode="nodeStore.activeNode"
                icon="mdi-lightning-bolt-outline"
                iconColor="#C1175A"
                :closeDrawerFunction="() => (drawer = !drawer)"
                :removeNodeFunction="onRemoveNode"
              />
              <v-text-field v-model="nodeStore.activeNode.data.type" />
            </template>

            <!-- for dateTime node types -->
            <template v-if="nodeStore.activeNode.type === 'dateTime'">
              <DrawerHeader
                :activeNode="nodeStore.activeNode"
                icon="mdi-calendar"
                iconColor="#FF561E"
                :closeDrawerFunction="() => (drawer = !drawer)"
                :removeNodeFunction="onRemoveNode"
              >
              </DrawerHeader>
              <v-row
                v-for="(time, index) in nodeStore.activeNode.data.times"
                :key="index"
              >
                <v-col cols="2">
                  <strong>{{ time.day }}</strong>
                </v-col>
                <v-col cols="5">
                  <TimePicker
                    label="Start Time"
                    :day="time.day"
                    :time="time.startTime"
                    fieldKey="startTime"
                  />
                </v-col>

                <v-col cols="5">
                  <TimePicker
                    label="End Time"
                    :day="time.day"
                    :time="time.endTime"
                    fieldKey="endTime"
                  />
                </v-col>
              </v-row>
            </template>

            <!-- for sendMessage node types -->
            <template v-if="nodeStore.activeNode.type === 'sendMessage'">
              <DrawerHeader
                :activeNode="nodeStore.activeNode"
                icon="mdi-send-circle-outline"
                iconColor="#3BACA1"
                :closeDrawerFunction="() => (drawer = !drawer)"
                :removeNodeFunction="onRemoveNode"
              />
              <v-row>
                <template
                  v-for="(node, index) in nodeStore.activeNode.data.payload"
                  :key="index"
                  no-gutters
                >
                  <v-col v-if="node.type === 'text'" cols="12">
                    <v-text-field v-model="node.text" />
                  </v-col>
                  <v-col v-if="node.type === 'attachment'" cols="4">
                    <v-img aspectRatio="16/9" :src="node.attachment"></v-img>
                  </v-col>
                </template>
              </v-row>
              <v-file-input
                accept="image/*"
                @change="onFileUpload"
              ></v-file-input>
              <input onchange="" />
            </template>

            <!-- for addComment node types -->
            <template v-if="nodeStore.activeNode.type === 'addComment'">
              <DrawerHeader
                :activeNode="nodeStore.activeNode"
                icon="mdi-message-reply-text-outline"
                iconColor="#7B84CB"
                :closeDrawerFunction="() => (drawer = !drawer)"
                :removeNodeFunction="onRemoveNode"
              />
              <v-text-field v-model="nodeStore.activeNode.data.comment" />
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
