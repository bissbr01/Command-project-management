import {
  createStyles,
  Group,
  Loader,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import dayjs from 'dayjs'
import { SetStateAction, useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import {
  useGetBacklogQuery,
  useUpdateIssueMutation,
} from '../../services/issuesEndpoints'
import {
  BacklogList,
  BacklogLists,
  useGetSprintsForBacklogQuery,
} from '../../services/sprintsEndpoints'
import { Issue, IssueStatus } from '../../services/types'
import IssueDrawer from '../issues/IssueDrawer'
import SprintMenu from '../sprints/SprintMenu'
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
}))

export default function Backlog() {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const { data: sprints } = useGetSprintsForBacklogQuery({ active: true })
  const { data: backlog } = useGetBacklogQuery()
  const [updateIssue] = useUpdateIssueMutation()
  const [issueOpened, setIssueOpened] = useState(false)
  const [lists, setLists] = useState<BacklogLists | null>(null)

  useEffect(() => {
    if (sprints && backlog) {
      const backlogList = {
        Backlog: {
          name: 'backlog',
          issues: backlog,
          sprint: null,
        },
      }

      // const backlogSprints: BacklogLists = {}

      // sprints.forEach((sprint) => {
      //   backlogSprints[`Sprint ${sprint.id}`] = {
      //     name: `Sprint ${sprint.id}`,
      //     issues: sprint.issues,
      //     sprint,
      //   }
      // })

      setLists({ ...sprints, ...backlogList })
    }
  }, [setLists, sprints, backlog])

  // only send id, status, and boardOrder to server
  const getListForUpdate = (list: BacklogList) => {
    const listForUpdate = list.issues.reduce<
      Pick<Issue, 'id' | 'status' | 'boardOrder' | 'sprintId'>[]
    >(
      (prev, { id, status, sprintId }, index) =>
        prev.concat({
          id,
          status,
          sprintId,
          boardOrder: index,
        }),
      []
    )
    return listForUpdate
  }

  const updateList = async (list: BacklogList) => {
    const listToUpdate = getListForUpdate(list)
    const promises = listToUpdate.map((issue) => updateIssue(issue).unwrap())
    const res = await Promise.all(promises)
    return res
  }

  const updateLists = async (items: BacklogList[]) => {
    const listsToUpdate = items.map((list) => getListForUpdate(list))
    const promises = listsToUpdate.map((list) =>
      list.map((issue) => updateIssue(issue).unwrap())
    )
    const res = await Promise.all(promises)
    return res
  }

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
          status: IssueStatus.Backlog,
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
      await updateLists([
        {
          ...sourceList,
          issues: sourceItems,
        },
        {
          ...destList,
          issues: destItems,
        },
      ])

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
      await updateList({
        ...list,
        issues: copiedItems,
      })
    }
  }

  if (!sprints || !backlog || !lists) return <Loader />

  return (
    <main>
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result, lists, setLists)}
      >
        <Title order={1} size="h2" p="sm">
          Backlog
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
                  <Text color="dimmed">
                    {`${dayjs(list.sprint.startOn).format('MMM DD')}
                    -
                    ${dayjs(list.sprint.endOn).format('MMM DD')}`}
                  </Text>
                  <SprintMenu sprint={list.sprint} />
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
              status={list.sprint ? IssueStatus.Todo : IssueStatus.Backlog}
            />
          </section>
        ))}
      </DragDropContext>
      <IssueDrawer
        issueOpened={issueOpened}
        setIssueOpened={setIssueOpened}
        redirectUrl="/backlog"
      />
    </main>
  )
}
