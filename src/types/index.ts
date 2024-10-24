export type Node = {
  id: string
  parentId: string
  type: NodeType
  name?: string
  data: NodeData
}
export type NodeType =
  | 'trigger'
  | 'sendMessage'
  | 'dateTime'
  | 'dateTimeConnector'
  | 'addComment'

type PayloadType =
  | { type: 'text'; text: string }
  | { type: 'attachment'; attachment: string }

export type Times = {
  startTime: string
  endTime: string
  day: string
}

type NodeData = {
  type?: string
  oncePerContact?: boolean
  payload?: PayloadType[]
  times?: Times[]
  connectors?: string[]
  timezone?: string
  action?: string
  connectorType?: 'success' | 'failure'
  comment?: string
}
