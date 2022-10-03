import { Badge, createStyles } from '@mantine/core'
import { assertUnreachable, IssueStatus } from '../../services/types'

const useStyles = createStyles((theme) => ({
  bug: {
    background: theme.colors.red[4],
  },
  task: {
    background: theme.colors.brand[4],
  },
  userStory: {
    background: theme.colors.blue[4],
  },
}))

export interface IssueStatusProps {
  issueStatus: IssueStatus
}

export default function IssueStatusDisplay({
  issueStatus,
}: IssueStatusProps): JSX.Element {
  const { classes } = useStyles()

  const getIssueStatus = () => {
    switch (issueStatus) {
      case IssueStatus.Backlog:
        return (
          <Badge radius="sm" color="violet">
            Backlog
          </Badge>
        )

      case IssueStatus.Todo:
        return (
          <Badge radius="sm" color="blue">
            Todo
          </Badge>
        )

      case IssueStatus.InProgress:
        return (
          <Badge radius="sm" color="teal">
            In Progress
          </Badge>
        )

      case IssueStatus.Done:
        return (
          <Badge radius="sm" color="green">
            Done
          </Badge>
        )

      default:
        return assertUnreachable(issueStatus)
    }
  }

  return getIssueStatus()
}
