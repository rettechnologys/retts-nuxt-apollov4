import { ref, computed } from 'vue'
import type { BlockNode, BlockType } from '@/utils/types/admin/block-v2.types'

let idCounter = 1
function genId(type: string) {
  return `blk_${type}_${String(idCounter++).padStart(3, '0')}`
}

function makeBlock(type: BlockType): BlockNode {
  const base: BlockNode = {
    id: genId(type),
    type,
    label: type,
    styleProps: {},
    style: { class: '' },
  }
  if (type === 'wrapper') base.children = []
  return base
}

function findNode(
  nodes: BlockNode[],
  id: string
): BlockNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

function findParent(
  nodes: BlockNode[],
  id: string,
  parent: BlockNode | null = null
): BlockNode | null {
  for (const node of nodes) {
    if (node.id === id) return parent
    if (node.children) {
      const found = findParent(node.children, id, node)
      if (found !== null) return found
    }
  }
  return null
}

function removeNode(nodes: BlockNode[], id: string): boolean {
  const idx = nodes.findIndex(n => n.id === id)
  if (idx !== -1) { nodes.splice(idx, 1); return true }
  for (const node of nodes) {
    if (node.children && removeNode(node.children, id)) return true
  }
  return false
}

function cloneNode(node: BlockNode): BlockNode {
  return JSON.parse(JSON.stringify({
    ...node,
    id: genId(node.type),
    children: node.children?.map(cloneNode),
  }))
}

function updateNodeInTree(
  nodes: BlockNode[],
  id: string,
  updater: (node: BlockNode) => void
): BlockNode[] {
  return nodes.map(node => {
    if (node.id === id) {
      const updated = { ...node }
      updater(updated)
      return updated
    }
    if (node.children) {
      return { ...node, children: updateNodeInTree(node.children, id, updater) }
    }
    return node
  })
}

export function useBlockTree() {
  const blocks = ref<BlockNode[]>([])
  const selectedId = ref<string | null>(null)

  const selectedBlock = computed(() =>
    selectedId.value ? findNode(blocks.value, selectedId.value) : null
  )

  function select(id: string) {
    selectedId.value = id
  }

  function addBlock(type: BlockType, parentId?: string | null) {
    const block = makeBlock(type)
    if (!parentId) {
      blocks.value.push(block)
    } else {
      const parent = findNode(blocks.value, parentId)
      if (parent && parent.children !== undefined) {
        parent.children.push(block)
      }
    }
    selectedId.value = block.id
    return block
  }

  function removeBlock(id: string) {
    if (selectedId.value === id) selectedId.value = null
    removeNode(blocks.value, id)
  }

  function duplicateBlock(id: string) {
    const node = findNode(blocks.value, id)
    if (!node) return
    const parent = findParent(blocks.value, id)
    const cloned = cloneNode(node)
    if (!parent) {
      const idx = blocks.value.findIndex(n => n.id === id)
      blocks.value.splice(idx + 1, 0, cloned)
    } else if (parent.children) {
      const idx = parent.children.findIndex(n => n.id === id)
      parent.children.splice(idx + 1, 0, cloned)
    }
    selectedId.value = cloned.id
  }

  function moveBlock(id: string, direction: 'up' | 'down') {
    const parent = findParent(blocks.value, id)
    const arr = parent ? parent.children! : blocks.value
    const idx = arr.findIndex(n => n.id === id)

    if (direction === 'up' && idx > 0) {
      const newArr = [...arr]
      const item = newArr.splice(idx, 1)[0]
      newArr.splice(idx - 1, 0, item)

      if (parent) {
        blocks.value = updateNodeInTree(blocks.value, parent.id, (node) => {
          node.children = newArr
        })
      } else {
        blocks.value = newArr
      }
    } else if (direction === 'down' && idx < arr.length - 1) {
      const newArr = [...arr]
      const item = newArr.splice(idx, 1)[0]
      newArr.splice(idx + 1, 0, item)

      if (parent) {
        blocks.value = updateNodeInTree(blocks.value, parent.id, (node) => {
          node.children = newArr
        })
      } else {
        blocks.value = newArr
      }
    }
  }

  function updateStyleProps(id: string, props: Record<string, unknown>) {
    blocks.value = updateNodeInTree(blocks.value, id, (node) => {
      node.styleProps = { ...node.styleProps, ...props }
    })
  }

  function updatePv(id: string, pv: Record<string, unknown>) {
    blocks.value = updateNodeInTree(blocks.value, id, (node) => {
      node.pv = { ...node.pv, ...pv }
    })
  }

  function updateLabel(id: string, label: string) {
    blocks.value = updateNodeInTree(blocks.value, id, (node) => {
      node.label = label
    })
  }

  function updateStyleClass(id: string, className: string) {
    blocks.value = updateNodeInTree(blocks.value, id, (node) => {
      node.style = { ...(node.style || {}), class: className }
    })
  }

  const exportSchema = computed(() => JSON.stringify(blocks.value, null, 2))

  return {
    blocks,
    selectedId,
    selectedBlock,
    select,
    addBlock,
    removeBlock,
    duplicateBlock,
    moveBlock,
    updateStyleProps,
    updateStyleClass,
    updatePv,
    updateLabel,
    exportSchema,
    findNode,
    findParent,
  }
}