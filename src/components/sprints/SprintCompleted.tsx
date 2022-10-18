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
import { FormEvent, SetStateAction, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  setOpened: React.Dispatch<SetStateAction<boolean>>
  redirectUrl?: string
}

export default function SprintCompleted({
  sprintId,
  setOpened,
  redirectUrl = '/',
}: SprintCompletedProps) {
  const navigate = useNavigate()
  const { data: sprint } = useGetSprintByIdQuery(sprintId ?? '1')
  const { data: sprints } = useGetSprintsQuery({ active: true })
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

  if (!sprint || !sprints) return <Loader />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      navigate(redirectUrl)
      setOpened(false)

      const issuesToCopy = sprint.issues.filter(
        (issue) => issue.status !== IssueStatus.Done
      )

      if (sprintSelect === SprintSelect.newSprint) {
        // create a new sprint and copy issues over
        const newSprint = await createSprint({
          goal: '',
          active: true,
          displayOnBoard: true,
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
      // in either case, remove issues from existing sprint and set to not active
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
        Complete Sprint {sprint.id}
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
          <Button variant="default" onClick={() => setOpened(false)}>
            Cancel
          </Button>
        </Group>
      </form>
    </Card>
  )
}
