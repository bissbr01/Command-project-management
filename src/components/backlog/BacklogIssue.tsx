import {
  ActionIcon,
  Avatar,
  createStyles,
  Group,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconEdit } from '@tabler/icons'
import { Issue, IssueStatus } from '../../services/types'
import IssueStatusDisplay from '../issues/IssueStatusDisplay'
import IssueTypeIcon from '../issues/IssueTypeIcon'

const useStyles = createStyles((theme) => ({
  container: {
    border: `1px solid ${theme.colors.gray[1]}`,
    padding: '5px',
  },

  groupLeft: {
    flex: '0 1 680px',
    minWidth: 0,
  },
  groupRight: {
    justifyContent: 'right',
    flex: '1 0 content',
  },

  noOverflow: {
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '500px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      minWidth: 0,
    },
  },
}))

interface BacklogIssueProps {
  issue: Issue
}

export default function BacklogIssue({ issue }: BacklogIssueProps) {
  const { classes } = useStyles()

  return (
    <Group className={classes.container}>
      <Group className={classes.groupLeft}>
        <IssueTypeIcon issueType={issue.type} />
        <Text
          color="dimmed"
          strikethrough={issue.status === IssueStatus.Done}
        >{`Sprint ${issue.sprintId}, Issue: ${issue.id}`}</Text>
        <Text className={classes.noOverflow}>{issue.title}</Text>
      </Group>
      <Group className={classes.groupRight}>
        <ActionIcon size="sm">
          <IconEdit stroke={1} />
        </ActionIcon>
        <IssueStatusDisplay issueStatus={issue.status} />
        <Avatar radius="xl" size="sm" />
      </Group>
    </Group>
  )
}
