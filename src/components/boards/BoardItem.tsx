import { createStyles, Text, useMantineTheme } from '@mantine/core'
import { Draggable } from 'react-beautiful-dnd'
import { Issue } from '../../services/types'

const useStyles = createStyles(() => ({
  draggable: {
    userSelect: 'none',
    padding: '1em',
    margin: '0 0 8px 0',
    minHeight: '50px',
  },
}))

interface BoardItemProps {
  item: Issue
  index: number
}

function BoardItem({ item: issue, index }: BoardItemProps): JSX.Element {
  const { classes } = useStyles()
  const theme = useMantineTheme()

  return (
    <Draggable draggableId={String(issue.id)} index={index}>
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
          <Text>{issue.id}</Text>
          <Text weight="bold">{issue.title}</Text>
          <Text>{issue.status}</Text>
          <Text>{issue.description}</Text>
        </div>
      )}
    </Draggable>
  )
}

export default BoardItem
