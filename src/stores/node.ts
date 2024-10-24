import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type Node as VueFlowNode,
  type Edge as VueFlowEdge,
  useVueFlow,
} from '@vue-flow/core'
import type { Node, Times } from '@/types'

const data: Node[] = [
  {
    id: '1',
    parentId: '-1',
    type: 'trigger',
    data: {
      type: 'conversationOpened',
      oncePerContact: false,
    },
  },
  {
    name: 'Away Message',
    id: 'b6a0c1',
    type: 'sendMessage',
    data: {
      payload: [
        {
          type: 'text',
          text: 'Sorry, we are currently away. We will respond as soon as possible.',
        },
      ],
    },
    parentId: '28c4b9',
  },
  {
    name: 'Business Hours',
    id: 'd09c08',
    type: 'dateTime',
    data: {
      times: [
        { startTime: '09:00', endTime: '17:00', day: 'mon' },
        { startTime: '09:00', endTime: '17:00', day: 'tue' },
        { startTime: '09:00', endTime: '17:00', day: 'wed' },
        { startTime: '09:00', endTime: '17:00', day: 'thu' },
        { startTime: '09:00', endTime: '17:00', day: 'fri' },
        { startTime: '09:00', endTime: '17:00', day: 'sat' },
        { startTime: '09:00', endTime: '17:00', day: 'sun' },
      ],
      connectors: ['161f52', '28c4b9'],
      timezone: 'UTC',
      action: 'businessHours',
    },
    parentId: '1',
  },
  {
    name: 'Success',
    id: '161f52',
    type: 'dateTimeConnector',
    data: { connectorType: 'success' },
    parentId: 'd09c08',
  },
  {
    name: 'Failure',
    id: '28c4b9',
    type: 'dateTimeConnector',
    data: { connectorType: 'failure' },
    parentId: 'd09c08',
  },
  {
    name: 'Welcome Message',
    id: 'b0653a',
    type: 'sendMessage',
    data: {
      payload: [
        { type: 'text', text: 'Hello there D welcome to the chat!' },
        {
          type: 'attachment',
          attachment:
            'https://fastly.picsum.photos/id/396/536/354.jpg?hmac=GmUosOuXb6nGkFhmTE-83i0ciQcaleMyvIyqzeFbW58',
        },
      ],
    },
    parentId: '161f52',
  },
  {
    id: 'e879e4',
    type: 'addComment',
    parentId: 'b6a0c1',
    name: 'Add Comment #1',
    data: { comment: 'User message during off hours' },
  },
]

// positions for each node
const positions = {
  // trigger
  '1': { x: 50, y: 50 },
  // Business Hours
  d09c08: { x: 50, y: 200 },
  // Success
  '161f52': { x: 0, y: 350 },
  // Welcome Message
  b0653a: { x: -41, y: 450 },
  // Failure
  '28c4b9': { x: 225, y: 350 },
  // Away Message
  b6a0c1: { x: 179, y: 450 },
  // Add Comment #1
  e879e4: { x: 179, y: 650 },
}

const { removeNodes } = useVueFlow()

export const useNodeStore = defineStore('node', () => {
  const activeNode = ref<VueFlowNode | undefined>(undefined)

  // Create nodes
  const nodes: Ref<VueFlowNode[]> = ref(
    data.map(node => ({
      id: node.id,
      data: {
        id: node.id,
        label: node.name || node.type,
        ...node.data,
      },
      position: positions[node.id as keyof typeof positions] || { x: 0, y: 0 },
      type: node.type,
    })),
  )

  // Create edges (based on parentId relationships)
  const edges: VueFlowEdge[] = data
    .filter(node => node.parentId && node.parentId !== '-1')
    .map(node => ({
      id: `e-${node.parentId}-${node.id}`,
      source: node.parentId,
      target: node.id,
    }))

  const setActiveNode = (id: string | undefined) =>
    (activeNode.value = nodes.value.find(node => node.id === id))

  const addNode = (nodeData: VueFlowNode) => nodes.value.push(nodeData)

  const updateTitle = (id: string, title: string) => {
    const node = nodes.value.find(item => item.id === id)
    if (node) {
      node.data.label = title
      nodes.value.map(item => {
        if (item.id === id) node
        item
      })
    }
  }

  const updateTime = (id: string, day: string, time: string, key: string) => {
    const node = nodes.value.find(item => item.id === id)
    if (node) {
      const nodeTimeData = node.data.times.find(
        (time: Times) => time.day === day,
      )
      if (nodeTimeData) {
        nodeTimeData[key] = time
      }
    }
  }

  const updateAttachments = (id: string, fileData: File) => {
    const node = nodes.value.find(item => item.id === id)

    if (node) {
      const reader = new FileReader()
      const imageRef = ref()

      reader.onload = e => (imageRef.value = e.target?.result)

      reader.readAsDataURL(fileData)

      node.data.payload.push({
        type: 'attachment',
        attachment: imageRef,
      })

      nodes.value.map(item => {
        if (item.id === id) node
        item
      })
    }
  }

  // remove node, and close drawer
  // pair with confirmation dialog
  const onRemoveNode = (id: string) => {
    removeNodes(id)
    nodes.value = nodes.value.filter(item => item.id !== id)
    setActiveNode(undefined)
  }

  return {
    nodes,
    edges,
    activeNode,
    updateTitle,
    updateTime,
    updateAttachments,
    setActiveNode,
    addNode,
    onRemoveNode,
  }
})
