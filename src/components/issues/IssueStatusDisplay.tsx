import { Badge, createStyles } from '@mantine/core'
import { assertUnreachable, IssueStatus } from '../../services/types'

const useStyles = createStyles((theme) => ({
  bug: {
    background: theme.colors.red[4],
  },
  todo: {
    background: theme.colors.gray[3],
    color: theme.colors.gray[6],
  },
  done: {
    background: theme.colors.green[1],
    color: theme.colors.green[8],
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
      case IssueStatus.Todo:
        return (
          <Badge radius="sm" className={classes.todo}>
            To Do
          </Badge>
        )

      case IssueStatus.InProgress:
        return (
          <Badge radius="sm" color="blue">
            In Progress
          </Badge>
        )

      case IssueStatus.Done:
        return (
          <Badge radius="sm" className={classes.done}>
            Done
          </Badge>
        )

      default:
        return assertUnreachable(issueStatus)
    }
  }

  return getIssueStatus()
}
