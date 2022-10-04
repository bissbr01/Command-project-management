import { createStyles, Loader, Paper, Space, Title } from '@mantine/core'
import { useGetIssuesByTokenQuery } from '../../services/issuesEndpoints'
import { useGetSprintByActiveQuery } from '../../services/sprintsEndpoints'
import { IssueStatus } from '../../services/types'
import BacklogCreateIssue from './BacklogCreateIssue'
import BacklogIssue from './BacklogIssue'

const useStyles = createStyles((theme) => ({
  section: {
    background: theme.colors.gray[1],
    padding: '0.5rem',
    borderRadius: theme.defaultRadius,
  },

  paper: {
    padding: '12px 12px 0 12px',
  },
}))

export default function Backlog() {
  const { classes } = useStyles()
  const { data: sprint, isLoading } = useGetSprintByActiveQuery()

  if (isLoading || !sprint) return <Loader />
  const { issues } = sprint

  if (!issues)
    return <div>You have no active Sprints. Create a sprint first</div>

  return (
    <main>
      <Title order={1} size="h2" p="sm">
        Backlog
      </Title>
      <section className={classes.section}>
        <Title order={2} size="h3" p="xs">{`Sprint ${sprint.id}`}</Title>
        <Paper className={classes.paper}>
          {issues
            .filter((issue) => issue.status !== IssueStatus.Backlog)
            .map((issue) => (
              <BacklogIssue key={issue.id} issue={issue} />
            ))}
        </Paper>
        <BacklogCreateIssue sprintId={sprint.id} status={IssueStatus.Todo} />
      </section>
      <Space h="lg" />
      <section className={classes.section}>
        <Title order={2} size="h3" p="xs">
          Backlog
        </Title>
        <Paper className={classes.paper}>
          {issues
            .filter((issue) => issue.status === IssueStatus.Backlog)
            .map((issue) => (
              <BacklogIssue key={issue.id} issue={issue} />
            ))}
        </Paper>
        <BacklogCreateIssue sprintId={sprint.id} status={IssueStatus.Backlog} />
      </section>
    </main>
  )
}
