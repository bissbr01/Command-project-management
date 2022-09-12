import {
  createStyles,
  Paper,
  Skeleton,
  Title,
  useMantineTheme,
} from '@mantine/core'
import React, { SetStateAction, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid'
import api from '../../services/scrumApi'
import { RootState } from '../../store'
import BoardItem, { DraggableItem } from './BoardItem'

const itemsFromBackend = [
  { id: uuid(), content: 'First task' },
  { id: uuid(), content: 'Second task' },
  { id: uuid(), content: 'Third task' },
  { id: uuid(), content: 'Fourth task' },
  { id: uuid(), content: 'Fifth task' },
  { id: uuid(), content: 'Sixth task' },
  { id: uuid(), content: 'Seventh task' },
  { id: uuid(), content: 'Eight task' },
]

const columnsFromBackend = {
  [uuid()]: {
    name: 'To do',
    items: itemsFromBackend,
  },
  [uuid()]: {
    name: 'In Progress',
    items: [],
  },
  [uuid()]: {
    name: 'Done',
    items: [],
  },
}

const useStyles = createStyles((theme) => ({
  boards: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  },
  board: {
    flex: '1',
    background: theme.colors.gray[0],
    // padding: '1em',
  },
  paper: {
    height: '100%',
  },

  droppable: {
    padding: 4,
    width: 250,
    minHeight: 300,
  },
}))

export interface BoardColumn {
  [x: string]: {
    name: string
    items: DraggableItem[]
  }
}

function Boards() {
  const [columns, setColumns] = useState(columnsFromBackend)
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const selectAuth = (state: RootState) => state.auth
  const { token } = useSelector(selectAuth)
  const { isLoading, isFetching, isError, data } =
    api.endpoints.getIssues.useQuery(undefined, {
      skip: !token,
    })

  const handleDragEnd = (
    result: DropResult,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    columns: BoardColumn,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setColumns: React.Dispatch<SetStateAction<BoardColumn>>
  ) => {
    if (!result.destination) return
    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }

  if (isError) return <div>An error has occurred!</div>

  if (isLoading || !data) {
    return (
      <>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </>
    )
  }

  console.log(data)

  return (
    <div className={classes.boards}>
      <div className={isFetching ? 'posts--disabled' : ''}>
        {data.map((issue) => (
          <div key={issue.id}>{issue.title}</div>
        ))}
      </div>
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column]) => (
          <Paper className={classes.paper} key={columnId}>
            <Title order={3}>{column.name}</Title>
            <div>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={classes.droppable}
                    style={{
                      background: snapshot.isDraggingOver
                        ? theme.colors.blue[0]
                        : theme.colors.gray[0],
                    }}
                  >
                    {column.items.map((item, index) => (
                      <BoardItem key={item.id} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </Paper>
        ))}
      </DragDropContext>
    </div>
  )
}

export default Boards
