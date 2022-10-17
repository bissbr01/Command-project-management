import {
  Button,
  Card,
  createStyles,
  Group,
  Image,
  List,
  Loader,
  Modal,
  NativeSelect,
  Text,
  Title,
} from '@mantine/core'
import { FormEvent, useState } from 'react'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import {
  useAddSprintMutation,
  useGetSprintsQuery,
  useLazyGetSprintByIdQuery,
  useUpdateSprintMutation,
} from '../../services/sprintsEndpoints'
import { Issue, IssueStatus, Sprint, BoardColumns } from '../../services/types'
import { updateIssues } from '../../services/util'
import trophyBanner from './trophy-banner.svg'

const useStyles = createStyles((theme) => ({
  header: {
    flex: '1 1 container',
    margin: '-20px -20px 0 -20px',
    borderTopLeftRadius: theme.radius.sm,
    borderTopRightRadius: theme.radius.sm,
  },

  iconContainer: {
    borderTopLeftRadius: theme.radius.sm,
    borderTopRightRadius: theme.radius.sm,
    display: 'flex',
    flex: '1 1 container',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.yellow[4],
  },
}))

interface SprintCompletedModalProps {
  sprint: Sprint
  boardColumns: BoardColumns
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SprintCompletedModal({
  sprint,
  boardColumns,
  opened,
  setOpened,
}: SprintCompletedModalProps) {
  const { data: sprints, isLoading } = useGetSprintsQuery({ active: true })
  const [fetchSprint] = useLazyGetSprintByIdQuery()
  const [createSprint] = useAddSprintMutation()
  const [updateSprint] = useUpdateSprintMutation()
  const [updateIssue] = useUpdateIssueMutation()
  const { classes } = useStyles()
  const [sprintSelect, setSprintSelect] = useState('newSprint')

  enum SprintSelect {
    newSprint = 'newSprint',
    backlog = 'backlog',
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setOpened(false)

      const issuesToCopy = sprint.issues.filter(
        (issue) => issue.status !== IssueStatus.Done
      )

      if (sprintSelect === SprintSelect.newSprint) {
        // create a new sprint and copy issues over
        await createSprint({
          goal: '',
          active: true,
          projectId: sprint.projectId,
          issues: issuesToCopy,
        })
      } else if (sprintSelect === SprintSelect.backlog) {
        // update each issue in sprint to set sprintId to null
        const issuesForUpdate = issuesToCopy.reduce<
          (Partial<Issue> & Pick<Issue, 'id'>)[]
        >(
          (prev, { id }) =>
            prev.concat({
              id,
              sprintId: null,
            }),
          []
        )
        await updateIssues(issuesForUpdate, updateIssue)
      } else {
        // find selected sprint and copy issues over
        const foundSprint = await fetchSprint(sprintSelect).unwrap()
        await updateSprint({
          id: Number(sprintSelect),
          active: true,
          issues: [...foundSprint.issues, ...issuesToCopy],
        })
      }
      // in either case, remove issues from existing sprint and set to not active
      await updateSprint({
        id: sprint.id,
        active: false,
        issues: sprint.issues.filter(
          (issue) => issue.status === IssueStatus.Done
        ),
      })
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading || !sprints || !boardColumns) return <Loader />

  const newerSprints = sprints
    .filter((s) => s.id > sprint.id)
    .map((s) => ({ value: String(s.id), label: `Sprint ${s.id}` }))

  const selectData = [
    ...newerSprints,
    { value: SprintSelect.backlog, label: 'Backlog' },
    { value: SprintSelect.newSprint, label: 'New Sprint' },
  ]

  const formatIssuePlural = (count: number, type: string) => {
    let s = `${count} ${type} `
    if (count === 1) s += 'issue'
    else s += 'issues'
    return s
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
    >
      <Card className={classes.header} px="1rem">
        <Card.Section>
          <Image src={trophyBanner} height={100} alt="trophy" />
        </Card.Section>
        <Title py="lg" order={2}>
          Complete Sprint {sprint.id}
        </Title>
        <Text>This Sprint contains:</Text>
        <List withPadding>
          <List.Item>
            {formatIssuePlural(boardColumns.done.issues.length, 'completed')}
          </List.Item>
          <List.Item>
            {formatIssuePlural(
              boardColumns.todo.issues.length +
                boardColumns.inProgress.issues.length,
              'open'
            )}
          </List.Item>
        </List>
        <form onSubmit={handleSubmit}>
          <NativeSelect
            py="sm"
            value={sprintSelect}
            onChange={(e) => setSprintSelect(e.target.value)}
            data={selectData}
            label="Move open issues to:"
          />
          <Group position="center" py="sm">
            <Button type="submit">Complete Sprint</Button>
            <Button variant="default" onClick={() => setOpened(false)}>
              Cancel
            </Button>
          </Group>
        </form>
      </Card>
    </Modal>
  )
}
