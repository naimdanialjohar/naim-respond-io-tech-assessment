<script lang="ts" setup>
import { ref } from 'vue'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow, Panel, type Node } from '@vue-flow/core'
import BusinessHoursNode from '../components/BusinessHoursNode.vue'
import CustomEdge from '../components/CustomEdge.vue'
import Drawer from '@/components/Drawer.vue'
import { useNodeStore, type NodeType } from '@/stores/node'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import DateTimeConnectorNode from '@/components/DateTimeConnectorNode.vue'
import SendMessageNode from '@/components/SendMessageNode.vue'
import AddCommentNode from '@/components/AddCommentNode.vue'
import TriggerNode from '@/components/TriggerNode.vue'

// todo list
// add draggable nodes based on the payload below
// add a create new node button, using addNodes function, have to pass position x and y
// - have title, description, type of node (send message, add comment, business hours)
// - have option to delete node ( use modal: https://vuetifyjs.com/en/components/dialogs/#persistent )
// each node have icon, title, truncated description
// each node have drawer when clicked to show the full details of that node ( https://vuetifyjs.com/en/components/navigation-drawers/#bottom-drawer )
// - send message type: display existing attachment as Tile/Box preview, also allow to upload new files, display existing text in editable input field
// - add comments type: display existing comments in editable input field
// - business hours type: display existing business hours, use datetimepicker to update business hours, success and failure connectorType is display only, no drawer

// OPTIONAL! Nice to haves:
// transition between canvas and nodes should be smooth
// add validation for input fields
// well written code, optimized renders, utility functions extracted into separate js file
// unit test on components

// aditional notes
// use Pinia for state management
// use Vue-Router for routing

const { onConnect, addEdges, addNodes, onNodeClick, getNodes, getEdges } =
  useVueFlow()
const { nodes, edges, setActiveNode, addNode } = useNodeStore()

onConnect(params => {
  console.log('params', params)
  addEdges([params])
})

addNodes(nodes)
addEdges(edges)

console.log('nodes', nodes)

onNodeClick(event => {
  console.log('lala', event.node.id)
  // blocks success, failure nodes from being accessed
  if (event.node.type !== 'dateTimeConnector') setActiveNode(event.node.id)
})

const typeOptions: NodeType[] = ['sendMessage', 'addComment', 'dateTime']

function onAddNode() {
  // add a single node to the graph

  const sendMessageData = typeRef.value === 'sendMessage' && {
    payload: [
      { type: 'text', text: descriptionRef.value },
      {
        type: 'attachment',
        attachment: '',
      },
    ],
  }
  const addCommentData = typeRef.value === 'addComment' && {
    comment: descriptionRef.value,
  }
  const dateTimeData = typeRef.value === 'dateTime' && {
    times: [
      { startTime: '00:00', endTime: '00:00', day: 'mon' },
      { startTime: '00:00', endTime: '00:00', day: 'tue' },
      { startTime: '00:00', endTime: '00:00', day: 'wed' },
      { startTime: '00:00', endTime: '00:00', day: 'thu' },
      { startTime: '00:00', endTime: '00:00', day: 'fri' },
      { startTime: '00:00', endTime: '00:00', day: 'sat' },
      { startTime: '00:00', endTime: '00:00', day: 'sun' },
    ],
    connectors: ['161f52', '28c4b9'],
    timezone: 'UTC',
    action: 'businessHours',
  }

  const randomId = Math.random().toString()

  const node: Node = {
    id: randomId,
    data: {
      id: randomId,
      label: titleRef.value,
      ...sendMessageData,
      ...addCommentData,
      ...dateTimeData,
    },
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    type: typeRef.value || '',
  }

  addNode(node)
  addNodes(node)
  reset()
}
const form = ref()
const titleRef = ref('')
const descriptionRef = ref('')
const typeRef = ref(null)
const required = (v: any) => {
  return !!v || 'Field is required'
}
const reset = () => {
  form.value.reset()
}
const validate = async () => {
  const { valid } = await form.value.validate()

  if (valid) onAddNode()
}
</script>

<template>
  <div style="height: 100vh">
    <Drawer>
      <VueFlow
        v-model:nodes="getNodes"
        v-model:edges="getEdges"
        fit-view-on-init
        class="vue-flow-basic-example"
        :default-zoom="1.5"
        :min-zoom="0.2"
        :max-zoom="4"
      >
        <template #node-trigger="node">
          <TriggerNode :node="node" />
        </template>

        <template #node-dateTime="node">
          <BusinessHoursNode :node="node as any" />
        </template>

        <template #node-dateTimeConnector>
          <DateTimeConnectorNode type="source" />
        </template>

        <template #node-sendMessage="node">
          <SendMessageNode :node="node" />
        </template>

        <template #node-addComment="node">
          <AddCommentNode :node="node" />
        </template>

        <template #edge-custom="edgeProps">
          <CustomEdge v-bind="edgeProps" />
        </template>
        <Background pattern-color="#aaa" :gap="8" />
        <MiniMap />
        <Controls />

        <Panel position="bottom-center">
          <ConfirmationDialog
            title="Create node"
            buttonText="Create a node"
            :onApprove="onAddNode"
            onApproveText="Create"
          >
            <v-form ref="form">
              <v-text-field
                label="Title"
                v-model="titleRef"
                :rules="[(v: any) => !!v || 'Title is required']"
              />
              <v-text-field
                label="Description"
                v-model="descriptionRef"
                :rules="[(v: any) => !!v || 'Description is required']"
              />
              <v-select
                label="Type"
                v-model="typeRef"
                :items="typeOptions"
                :rules="[(v: any) => !!v || 'Type is required']"
              />
              <v-btn block @click="validate"> Create </v-btn>
            </v-form>
          </ConfirmationDialog>
        </Panel>
      </VueFlow>
    </Drawer>
  </div>
</template>
