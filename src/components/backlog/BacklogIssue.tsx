import {
  Avatar,
  createStyles,
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { SetStateAction } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'
import { Issue, IssueStatus } from '../../services/types'
import IssueStatusDisplay from '../issues/IssueStatusDisplay'
import IssueStoryPointsDisplay from '../issues/IssueStoryPointsDisplay'
import IssueTypeIcon from '../issues/IssueTypeIcon'

const useStyles = createStyles((theme) => ({
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

  const handleClick = () => {
    setIssueOpened(true)
    navigate(`issues/${issue.id}`)
  }

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
          <UnstyledButton onClick={handleClick} sx={{ width: '100%' }}>
            <Group id="clickTarget">
              <Group className={classes.groupLeft}>
                <IssueTypeIcon issueType={issue.type} />
                <Text
                  color="dimmed"
                  strikethrough={issue.status === IssueStatus.Done}
                >
                  {issue.name}
                </Text>
                <Text className={classes.noOverflow}>{issue.title}</Text>
              </Group>
              <Group className={classes.groupRight}>
                <IssueStoryPointsDisplay storyPoints={issue.storyPoints} />
                <IssueStatusDisplay status={issue.status} />
                <Avatar
                  src={issue.assignee?.picture}
                  alt={issue.assignee?.nickname}
                  size="sm"
                  color="gray"
                  radius="xl"
                >
                  {issue.assignee?.nickname}
                </Avatar>
              </Group>
            </Group>
          </UnstyledButton>
        </div>
      )}
    </Draggable>
  )
}
