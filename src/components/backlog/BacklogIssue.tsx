import {
  ActionIcon,
  Avatar,
  createStyles,
  Group,
  Text,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core'
import { IconEdit } from '@tabler/icons'
import { Draggable } from 'react-beautiful-dnd'
import { Issue, IssueStatus } from '../../services/types'
import IssueStatusDisplay from '../issues/IssueStatusDisplay'
import IssueTypeIcon from '../issues/IssueTypeIcon'

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.white,
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
  index: number
}

export default function BacklogIssue({ issue, index }: BacklogIssueProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()

  return (
    <Draggable
      draggableId={String(issue.id)}
      index={index}
      disableInteractiveElementBlocking
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // className={classes.draggable}
          style={{
            backgroundColor: snapshot.isDragging ? theme.colors.brand[0] : '',
            ...provided.draggableProps.style,
          }}
        >
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
        </div>
      )}
    </Draggable>
  )
}
