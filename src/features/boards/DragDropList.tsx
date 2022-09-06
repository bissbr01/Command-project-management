import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from './SortableItem'

export interface DragDropListProps {
  items: string[] | number[]
}

function DragDropList({ items }: DragDropListProps) {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {items.map((id) => (
        <SortableItem key={id} id={id} />
      ))}
    </SortableContext>
  )
}

export default DragDropList
