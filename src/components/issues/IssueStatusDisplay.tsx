import { Badge, createStyles } from '@mantine/core'
import { assertUnreachable, IssueStatus } from '../../services/types'

const useStyles = createStyles((theme) => ({
  todo: {
    background: theme.colors.gray[3],
    color: theme.colors.gray[6],
  },
  done: {
    background: theme.colors.green[1],
    color: theme.colors.green[8],
  },

  badge: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))

export interface IssueStatusProps {
  status: IssueStatus
}

export default function IssueStatusDisplay({
  status: issueStatus,
}: IssueStatusProps): JSX.Element {
  const { classes, cx } = useStyles()

  const getIssueStatus = () => {
    switch (issueStatus) {
      case IssueStatus.Todo:
        return (
          <Badge radius="sm" className={cx(classes.todo, classes.badge)}>
            To Do
          </Badge>
        )

      case IssueStatus.InProgress:
        return (
          <Badge radius="sm" color="blue" className={classes.badge}>
            In Progress
          </Badge>
        )

      case IssueStatus.Done:
        return (
          <Badge radius="sm" className={cx(classes.done, classes.badge)}>
            Done
          </Badge>
        )

      default:
        return assertUnreachable(issueStatus)
    }
  }

  return getIssueStatus()
}
