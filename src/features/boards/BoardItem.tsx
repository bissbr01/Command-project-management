import { createStyles, Text, useMantineTheme } from '@mantine/core'
import { Draggable } from 'react-beautiful-dnd'

const useStyles = createStyles((theme) => ({
  draggable: {
    userSelect: 'none',
    padding: '1em',
    margin: '0 0 8px 0',
    minHeight: '50px',
  },
}))

export interface DraggableItem {
  id: string
  content: string
}

interface BoardItemProps {
  item: DraggableItem
  index: number
}

function BoardItem({ item, index }: BoardItemProps): JSX.Element {
  const { classes } = useStyles()
  const theme = useMantineTheme()

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.draggable}
          style={{
            backgroundColor: snapshot.isDragging
              ? theme.colors.brand[0]
              : 'white',
            ...provided.draggableProps.style,
          }}
        >
          <Text weight="bold">{item.content}</Text>
          <Text>{item.id}</Text>
        </div>
      )}
    </Draggable>
  )
}

export default BoardItem
