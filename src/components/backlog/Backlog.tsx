import {
  createStyles,
  Group,
  Loader,
  Paper,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { IconChalkboard } from '@tabler/icons'
import dayjs from 'dayjs'
import { SetStateAction, useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import {
  useGetBacklogQuery,
  useUpdateIssueMutation,
} from '../../services/issuesEndpoints'
import {
  useAddSprintMutation,
  useGetSprintsForBacklogQuery,
} from '../../services/sprintsEndpoints'
import { Issue, IssueStatus, BacklogLists } from '../../services/types'
import {
  getIssuesForUpdate,
  updateIssues,
  updateListIssues,
} from '../../services/util'
import IssueDrawer from '../issues/IssueDrawer'
import SprintCompletedButton from '../sprints/SprintCompletedButton'
import SprintCompletedModal from '../sprints/SprintCompletedModal'
import SprintEditModal from '../sprints/SprintEditModal'
import SprintMenu from '../sprints/SprintMenu'
import SprintStartButton from '../sprints/SprintStartButton'
import BacklogCreateIssue from './BacklogCreateIssue'
import BacklogIssue from './BacklogIssue'

const useStyles = createStyles((theme) => ({
  section: {
    background: theme.colors.gray[1],
    padding: '0.5rem',
    borderRadius: theme.defaultRadius,
    marginBottom: '2rem',
  },

  paper: {
    padding: '12px',
  },

  icon: {
    color: theme.colors.blue[3],
  },
}))

export default function Backlog() {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const { data: sprints } = useGetSprintsForBacklogQuery({ active: true })
  const { data: backlog } = useGetBacklogQuery()
  const [updateIssue] = useUpdateIssueMutation()
  const [createSprint] = useAddSprintMutation()
  const [issueOpened, setIssueOpened] = useState(false)
  const [sprintOpened, setSprintOpened] = useState(false)
  const [sprintEditOpened, setSprintEditOpened] = useState(false)
  const [lists, setLists] = useState<BacklogLists | null>(null)

  useEffect(() => {
    // if only 1 active sprint, create another to have planning space
    if (sprints && Object.keys(sprints).length <= 1) {
      Object.entries(sprints)
      createSprint({
        goal: '',
        active: true,
        displayOnBoard: false,
        projectId: 1, // FIX!  refactor away project id hardcode
      })
    }
  }, [createSprint, sprints])

  useEffect(() => {
    if (sprints && backlog) {
      const backlogList = {
        Backlog: {
          name: 'backlog',
          issues: backlog,
          sprint: null,
        },
      }

      setLists({ ...sprints, ...backlogList })
    }
  }, [setLists, sprints, backlog])

  const issuePropertiesToUpdate = (issue: Issue) => ({
    sprintId: issue.sprintId,
    status: issue.status,
  })

  const handleDragEnd = async (
    result: DropResult,
    items: BacklogLists,
    setItems: React.Dispatch<SetStateAction<BacklogLists | null>>
  ) => {
    if (!result.destination) return
    const { source, destination } = result

    // item dragged to new column
    if (source.droppableId !== destination.droppableId) {
      const sourceList = items[source.droppableId]
      const destList = items[destination.droppableId]
      const sourceItems = [...sourceList.issues]
      const destItems = [...destList.issues]
      const [removedIssue] = sourceItems.splice(source.index, 1)

      let movedIssue = {
        ...removedIssue,
        status: IssueStatus.Todo,
        sprintId: destList.sprint?.id ?? null,
      }

      if (destination.droppableId === 'Backlog') {
        movedIssue = {
          ...removedIssue,
          status: IssueStatus.Todo,
          sprintId: null,
        }
      }

      destItems.splice(destination.index, 0, movedIssue)

      // update local state
      setItems({
        ...items,
        [source.droppableId]: {
          ...sourceList,
          issues: sourceItems,
        },
        [destination.droppableId]: {
          ...destList,
          issues: destItems,
        },
      })

      // update backend
      const listsToUpdate = [
        {
          ...sourceList,
          issues: sourceItems,
        },
        {
          ...destList,
          issues: destItems,
        },
      ]

      await updateListIssues(
        listsToUpdate,
        updateIssue,
        issuePropertiesToUpdate
      )

      // item dragged within same column
    } else {
      const list = items[source.droppableId]
      const copiedItems = [...list.issues]
      const [removedIssue] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removedIssue)

      // update local state
      setItems({
        ...items,
        [source.droppableId]: {
          ...list,
          issues: copiedItems,
        },
      })

      // update backend
      const issuesToUpdate = {
        ...list,
        issues: copiedItems,
      }

      const listToUpdate = getIssuesForUpdate(
        issuesToUpdate,
        issuePropertiesToUpdate
      )
      await updateIssues(listToUpdate, updateIssue)
    }
  }

  if (!sprints || !backlog || !lists) return <Loader />

  return (
    <main>
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result, lists, setLists)}
      >
        <Title order={1} size="h2" p="sm">
          Plan
        </Title>
        {/* iterate each sprint | backlog list */}
        {Object.entries(lists).map(([listKey, list]) => (
          <section className={classes.section} key={listKey}>
            <Group>
              <Title order={2} size="h3" p="xs">
                {listKey}
              </Title>
              {list.sprint && (
                <>
                  {list.sprint.startOn && (
                    <Text color="dimmed">
                      {`${dayjs(list.sprint.startOn).format('MMM DD')}
                    -
                    ${dayjs(list.sprint.endOn).format('MMM DD')}`}
                    </Text>
                  )}
                  <Group m="0 2rem 0 auto">
                    {list.sprint.displayOnBoard && (
                      <Tooltip label="Sprint is displayed on board">
                        <span className={classes.icon}>
                          <IconChalkboard stroke={1.5} />
                        </span>
                      </Tooltip>
                    )}
                    {list.sprint.startOn ? (
                      <SprintCompletedButton
                        sprintId={list.sprint.id}
                        setOpened={setSprintOpened}
                      />
                    ) : (
                      <SprintStartButton
                        sprintId={list.sprint.id}
                        setOpened={setSprintEditOpened}
                      />
                    )}
                    <SprintMenu
                      sprintId={list.sprint.id}
                      setEditOpened={setSprintEditOpened}
                    />
                  </Group>
                </>
              )}
            </Group>
            <Paper className={classes.paper}>
              <Droppable droppableId={listKey}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver
                        ? theme.colors.blue[0]
                        : theme.colors.gray[0],
                    }}
                  >
                    {/* Iterate each issue in each sprint | backlog list */}
                    {list.issues.map((issue, index) => (
                      <BacklogIssue
                        key={issue.id}
                        issue={issue}
                        index={index}
                        setIssueOpened={setIssueOpened}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Paper>
            <BacklogCreateIssue
              sprintId={list.sprint?.id ?? null}
              status={IssueStatus.Todo}
            />
          </section>
        ))}
      </DragDropContext>
      <SprintEditModal
        opened={sprintEditOpened}
        setOpened={setSprintEditOpened}
      />
      <SprintCompletedModal opened={sprintOpened} setOpened={setSprintOpened} />
      <IssueDrawer issueOpened={issueOpened} setIssueOpened={setIssueOpened} />
    </main>
  )
}
