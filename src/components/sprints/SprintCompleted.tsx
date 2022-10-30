import {
  Button,
  Card,
  createStyles,
  Group,
  Image,
  List,
  Loader,
  NativeSelect,
  Text,
  Title,
} from '@mantine/core'
import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import {
  useAddSprintMutation,
  useGetSprintByIdQuery,
  useGetSprintsQuery,
  useLazyGetSprintByIdQuery,
  useUpdateSprintMutation,
} from '../../services/sprintsEndpoints'
import { Issue, IssueStatus } from '../../services/types'
import { updateIssues } from '../../services/util'
import LoadingCircle from '../common/LoadingCircle'
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

export interface SprintCompletedProps {
  sprintId: string
  handleClose: () => void
}

export default function SprintCompleted({
  sprintId,
  handleClose,
}: SprintCompletedProps) {
  const { projectId } = useParams()
  const { data: sprint } = useGetSprintByIdQuery(sprintId as string)
  const { data: sprints } = useGetSprintsQuery({ projectId, active: true })
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

  if (!sprint || !sprints) return <LoadingCircle />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      handleClose()

      const issuesToCopy = sprint.issues.filter(
        (issue) => issue.status !== IssueStatus.Done
      )

      if (sprintSelect === SprintSelect.newSprint) {
        // create a new sprint and copy issues over
        const newSprint = await createSprint({
          goal: '',
          active: true,
          displayOnBoard: true,
          isBacklog: false,
          projectId: sprint.projectId,
        }).unwrap()

        const issuesForUpdate = issuesToCopy.reduce<
          (Partial<Issue> & Pick<Issue, 'id'>)[]
        >(
          (prev, { id }) =>
            prev.concat({
              id,
              sprintId: newSprint.id,
            }),
          []
        )
        await updateIssues(issuesForUpdate, updateIssue)
      } else if (sprintSelect === SprintSelect.backlog) {
        // get Backlog Sprint Id and set issues to that sprint.
        // TODO
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
        })

        const issuesForUpdate = issuesToCopy.reduce<
          (Partial<Issue> & Pick<Issue, 'id'>)[]
        >(
          (prev, { id }) =>
            prev.concat({
              id,
              sprintId: foundSprint.id,
            }),
          []
        )
        await updateIssues(issuesForUpdate, updateIssue)
      }
      // in either case, set Sprint to archive
      await updateSprint({
        id: sprint.id,
        active: false,
        displayOnBoard: false,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const newerSprints = sprints
    .filter((s) => s.active === true && s.id !== sprint.id)
    .map((s) => ({ value: String(s.id), label: s.name }))

  const selectData = [
    ...newerSprints,
    { value: SprintSelect.newSprint, label: 'New Sprint' },
  ]

  const formatIssuePlural = (count: number, type: string) => {
    let s = `${count} ${type} `
    if (count === 1) s += 'issue'
    else s += 'issues'
    return s
  }

  const openIssueCount = sprint.issues.filter(
    (issue) => issue.status !== IssueStatus.Done
  ).length

  const completedIssueCount = sprint.issues.length - openIssueCount

  return (
    <Card className={classes.header} px="1rem">
      <Card.Section>
        <Image src={trophyBanner} height={100} alt="trophy" />
      </Card.Section>
      <Title py="lg" order={2}>
        Complete {sprint.name}
      </Title>
      <Text>This Sprint contains:</Text>
      <List withPadding>
        <List.Item>
          {formatIssuePlural(completedIssueCount, 'completed')}
        </List.Item>
        <List.Item>{formatIssuePlural(openIssueCount, 'open')}</List.Item>
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
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
        </Group>
      </form>
    </Card>
  )
}
