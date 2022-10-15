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
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconTrophy } from '@tabler/icons'
import { url } from 'inspector'
import { FormEvent, useState } from 'react'
import { BoardColumns } from '../../services/issuesEndpoints'
import {
  useAddSprintMutation,
  useGetSprintsQuery,
  useLazyGetSprintByIdQuery,
  useUpdateSprintMutation,
} from '../../services/sprintsEndpoints'
import { IssueStatus, Sprint } from '../../services/types'
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
  const [fetchSprint, { data: fetchedSprint }] = useLazyGetSprintByIdQuery()
  const [createSprint] = useAddSprintMutation()
  const [updateSprint] = useUpdateSprintMutation()
  const { classes } = useStyles()
  const [sprintSelect, setSprintSelect] = useState('newSprint')

  enum SprintSelect {
    newSprint = 'newSprint',
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
    .map((s) => ({ value: String(s.id), label: `Sprint ${s.projectId}` }))

  const selectData = [
    { value: SprintSelect.newSprint, label: 'New Sprint' },
    ...newerSprints,
  ]

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
            {boardColumns.done.issues.length} completed issue(s)
          </List.Item>
          <List.Item>
            {boardColumns.todo.issues.length +
              boardColumns.inProgress.issues.length}{' '}
            open issue(s)
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
