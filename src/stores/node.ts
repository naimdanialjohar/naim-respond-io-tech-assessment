import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type Node as VueFlowNode,
  type Edge as VueFlowEdge,
  useVueFlow,
  useNode,
} from '@vue-flow/core'

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

export type NodeType =
  | 'trigger'
  | 'sendMessage'
  | 'dateTime'
  | 'dateTimeConnector'
  | 'addComment'

type PayloadType =
  | { type: 'text'; text: string }
  | { type: 'attachment'; attachment: string }

type NodeData = {
  type?: string
  oncePerContact?: boolean
  payload?: PayloadType[]
  times?: {
    startTime: string
    endTime: string
    day: string
  }[]
  connectors?: string[]
  timezone?: string
  action?: string
  connectorType?: 'success' | 'failure'
  comment?: string
}

type Node = {
  id: string
  parentId: string
  type: NodeType
  name?: string
  data: NodeData
}

// Define positions for each node (for demo purposes)
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

const { updateNode } = useVueFlow()

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

  const setActiveNode = (id: string | undefined) => {
    // console.log('yay! using pinia store')
    activeNode.value = nodes.value.find(node => node.id === id)
    console.log('activeNode', activeNode.value)
  }

  const addNode = (nodeData: VueFlowNode) => {
    nodes.value.push(nodeData)
  }

  const updateTitle = (id: string, title: string) => {
    const node = nodes.value.find(item => item.id === id)
    if (node) {
      node.data.label = title
      nodes.value = [...nodes.value, { ...node }]
    }
  }

  return { nodes, edges, activeNode, updateTitle, setActiveNode, addNode }
})
