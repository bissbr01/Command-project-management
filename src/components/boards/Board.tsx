import { createStyles, Paper, Title, useMantineTheme } from '@mantine/core'
import { useParams } from 'react-router-dom'
import React, { SetStateAction, useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import BoardItem from './BoardItem'
import { IssueStatus, BoardColumns, UsersById } from '../../services/types'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import IssueDrawer from '../issues/IssueDrawer'
import { useGetSprintForBoardQuery } from '../../services/sprintsEndpoints'
import {
  emptyIssueProperties,
  getIssuesForUpdate,
  updateIssues,
  updateListIssues,
} from '../../services/util'
import LoadingCircle from '../common/LoadingCircle'
import BacklogCreateIssue from '../backlog/BacklogCreateIssue'
import BoardUserFilter from './BoardUserFilter'
import { useGetProjectByIdQuery } from '../../services/projectsEndpoints'

const useStyles = createStyles((theme) => ({
  boards: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '1rem',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  },
  board: {
    flex: '0 0 content',
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

function Board() {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [updateIssue] = useUpdateIssueMutation()
  const [issueOpened, setIssueOpened] = useState(false)
  const { projectId } = useParams()
  const { data: project } = useGetProjectByIdQuery(projectId as string)
  const { data: boardColumnsData } = useGetSprintForBoardQuery({
    projectId,
  })
  const [columns, setColumns] = useState<BoardColumns | null>(null)

  useEffect(() => {
    if (boardColumnsData) {
      setColumns(boardColumnsData.boardColumns)
    }
  }, [setColumns, boardColumnsData])

  const handleFilterByUserClick = (users: UsersById) => {
    if (!columns || !boardColumnsData) return
    if (Object.keys(users).length === 0) {
      setColumns(boardColumnsData.boardColumns)
    } else {
      const filteredColumns: BoardColumns = {}
      Object.entries(boardColumnsData.boardColumns).forEach(
        ([status, column]) => {
          filteredColumns[status] = {
            ...column,
            issues: column.issues.filter((issue) => issue.assigneeId in users),
          }
        }
      )
      setColumns(filteredColumns)
    }
  }

  const handleDragEnd = async (
    result: DropResult,
    cols: BoardColumns,
    setItems: React.Dispatch<SetStateAction<BoardColumns | null>>
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
      }
      destItems.splice(destination.index, 0, movedIssue)

      // update local state
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

      // update backend
      const colsToUpdate = [
        {
          ...sourceColumn,
          issues: sourceItems,
        },
        {
          ...destColumn,
          issues: destItems,
        },
      ]

      await updateListIssues(colsToUpdate, updateIssue, emptyIssueProperties)

      // item dragged within same column
    } else {
      const column = cols[source.droppableId]
      const copiedItems = [...column.issues]
      const [removedIssue] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removedIssue)

      // update local state
      setItems({
        ...cols,
        [source.droppableId]: {
          ...column,
          issues: copiedItems,
        },
      })

      // update backend
      const colToUpdate = {
        ...column,
        issues: copiedItems,
      }

      const colForUpdate = getIssuesForUpdate(colToUpdate, emptyIssueProperties)
      await updateIssues(colForUpdate, updateIssue)
    }
  }

  if (!boardColumnsData || !columns || !project) return <LoadingCircle />

  return (
    <>
      {project.team && (
        <BoardUserFilter
          team={project.team}
          handleClick={handleFilterByUserClick}
        />
      )}
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
                          : theme.colors.gray[1],
                      }}
                    >
                      {column.issues.map((item, index) => (
                        <BoardItem
                          key={item.id}
                          item={item}
                          index={index}
                          setIssueOpened={setIssueOpened}
                        />
                      ))}
                      {provided.placeholder}
                      {column.status !== IssueStatus.Done && (
                        <BacklogCreateIssue
                          sprintId={boardColumnsData.sprint.id}
                          status={column.status}
                          size="sm"
                        />
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </Paper>
          ))}
        </DragDropContext>
        <IssueDrawer
          issueOpened={issueOpened}
          setIssueOpened={setIssueOpened}
        />
      </div>
    </>
  )
}

export default Board
