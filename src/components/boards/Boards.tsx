import {
  Button,
  createStyles,
  Paper,
  Title,
  useMantineTheme,
} from '@mantine/core'
import React, { SetStateAction, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import BoardItem from './BoardItem'
import { Issue, IssueStatus } from '../../services/types'
import {
  useUpdateIssueMutation,
  useUpdateIssuesMutation,
} from '../../services/issuesEndpoints'

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
  [x: string]: BoardColumn
}

export interface BoardColumn {
  status: IssueStatus
  name: string
  issues: Issue[]
}

function Boards({ initColumns }: { initColumns: BoardColumns }) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [columns, setColumns] = useState(initColumns)
  const [updateIssue] = useUpdateIssueMutation()
  // const [updateIssues] = useUpdateIssuesMutation()

  const getColForUpdate = (col: BoardColumn) => {
    const colForUpdate = col.issues.reduce<
      Pick<Issue, 'id' | 'status' | 'boardOrder'>[]
    >(
      (prev, { id }, index) =>
        prev.concat({
          id,
          status: col.status,
          boardOrder: index,
        }),
      []
    )
    return colForUpdate
  }

  const updateCol = async (col: BoardColumn) => {
    const colToUpdate = getColForUpdate(col)
    const promises = colToUpdate.map((issue) => updateIssue(issue).unwrap())
    const res = await Promise.all(promises)
    return res
  }

  const handleSave = async (boardCols: BoardColumns) => {
    const statuses = Object.values(IssueStatus).filter(
      (status) => status !== IssueStatus.Backlog
    )
    const updates = statuses.map((status) => updateCol(boardCols[status]))

    const res = await Promise.all(updates)
    console.log('response of state update: ', res)
  }

  const handleDragEnd = async (
    result: DropResult,
    cols: BoardColumns,
    setItems: React.Dispatch<SetStateAction<BoardColumns>>
  ) => {
    if (!result.destination) return
    const { source, destination } = result

    // item dragged to new column
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = cols[source.droppableId]
      const destColumn = cols[destination.droppableId]
      const sourceItems = [...sourceColumn.issues]
      const destItems = [...destColumn.issues]
      const [removedIssue] = sourceItems.splice(source.index, 1)
      const movedIssue = {
        ...removedIssue,
        status: destination.droppableId as IssueStatus,
        boardOrder: destination.index,
      }
      destItems.splice(destination.index, 0, movedIssue)
      setItems({
        ...cols,
        [source.droppableId]: {
          ...sourceColumn,
          issues: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          issues: destItems,
        },
      })

      // item dragged within same column
    } else {
      const column = cols[source.droppableId]
      const copiedItems = [...column.issues]
      const [removedIssue] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removedIssue)
      setItems({
        ...cols,
        [source.droppableId]: {
          ...column,
          issues: copiedItems,
        },
      })
    }
  }

  return (
    <>
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
                      {column.issues.map((item, index) => (
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
      <div>
        <Button onClick={() => handleSave(columns)}>Save</Button>
      </div>
    </>
  )
}

export default Boards
