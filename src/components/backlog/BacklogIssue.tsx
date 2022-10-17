import {
  ActionIcon,
  Avatar,
  createStyles,
  Group,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { IconEdit } from '@tabler/icons'
import { SetStateAction, useEffect, useRef } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'
import { Issue, IssueStatus } from '../../services/types'
import IssueStatusDisplay from '../issues/IssueStatusDisplay'
import IssueTypeIcon from '../issues/IssueTypeIcon'

const useStyles = createStyles((theme) => ({
  container: {
    // backgroundColor: theme.white,
  },

  groupLeft: {
    flex: '0 1 640px',
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

  draggable: {
    userSelect: 'none',
    backgroundColor: theme.white,
    border: `1px solid ${theme.colors.gray[1]}`,
    padding: '5px',
    '&:hover': {
      background: theme.colors.brand[0],
    },
  },
}))

interface BacklogIssueProps {
  issue: Issue
  index: number
  setIssueOpened: React.Dispatch<SetStateAction<boolean>>
}

export default function BacklogIssue({
  issue,
  index,
  setIssueOpened,
}: BacklogIssueProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = () => {
      setIssueOpened(true)
      navigate(`/backlog/${issue.id}`)
    }
    const { current } = ref
    current?.addEventListener('click', handleClick)
    return () => {
      current?.removeEventListener('click', handleClick)
    }
  }, [issue.id, navigate, setIssueOpened])

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
          className={classes.draggable}
          style={{
            backgroundColor: snapshot.isDragging ? theme.colors.brand[0] : '',
            ...provided.draggableProps.style,
          }}
        >
          <Group id="clickTarget" className={classes.container}>
            <Group className={classes.groupLeft}>
              <IssueTypeIcon issueType={issue.type} />
              <Text
                color="dimmed"
                strikethrough={issue.status === IssueStatus.Done}
              >{`Issue: ${issue.id}`}</Text>
              <Text className={classes.noOverflow}>{issue.title}</Text>
            </Group>
            <Group className={classes.groupRight} ref={ref}>
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
