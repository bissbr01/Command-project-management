import { createStyles, Paper, Title, useMantineTheme } from '@mantine/core'
import React, { SetStateAction, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import BoardItem from './BoardItem'
import { Issue, IssueStatus } from '../../services/types'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'

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

export interface BoardColumns {
  [x: string]: {
    status: IssueStatus
    name: string
    items: Issue[]
  }
}

function Boards({ boardColumns }: { boardColumns: BoardColumns }) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [columns, setColumns] = useState(boardColumns)
  const [updateIssue] = useUpdateIssueMutation()

  const handleDragEnd = async (
    result: DropResult,
    items: BoardColumns,
    setItems: React.Dispatch<SetStateAction<BoardColumns>>
  ) => {
    if (!result.destination) return
    const { source, destination } = result

    // item dragged to new column
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = items[source.droppableId]
      const destColumn = items[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removedIssue] = sourceItems.splice(source.index, 1)
      const movedIssue = {
        ...removedIssue,
        status: destination.droppableId as IssueStatus,
      }
      destItems.splice(destination.index, 0, movedIssue)
      setItems({
        ...items,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
      console.log('moved Issue: ', movedIssue)
      await updateIssue(movedIssue)
      // item dragged within same column
    } else {
      const column = items[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setItems({
        ...items,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }

  // if (isError) return <div>An error has occurred!</div>
  // if (!data) return <div>Failed to fetch issues</div>
  // if (isLoading) {
  //   return (
  //     <>
  //       <Skeleton height={50} circle mb="xl" />
  //       <Skeleton height={8} radius="xl" />
  //       <Skeleton height={8} mt={6} radius="xl" />
  //       <Skeleton height={8} mt={6} width="70%" radius="xl" />
  //     </>
  //   )
  // }

  // if (!columns) {
  //   setColumns((state) => ({
  //     ...state,
  //     [IssueStatus.Todo]: {
  //       ...state[IssueStatus.Todo],
  //       items: data,
  //     },
  //   }))
  // }

  return (
    <div className={classes.boards}>
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
