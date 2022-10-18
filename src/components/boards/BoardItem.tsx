import {
  createStyles,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { SetStateAction } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'
import { Issue } from '../../services/types'
import IssueStoryPointsDisplay from '../issues/IssueStoryPointsDisplay'
import IssueTypeIcon from '../issues/IssueTypeIcon'

const useStyles = createStyles((theme) => ({
  draggable: {
    userSelect: 'none',
    padding: '1em',
    margin: '0 0 8px 0',
    minHeight: '50px',
    background: theme.white,
    '&:hover': {
      background: theme.colors.brand[0],
    },
  },
  issueStatus: {
    color: theme.colors.gray[6],
    fontSize: '.8em',
    paddingTop: '.5em',
  },
}))

interface BoardItemProps {
  item: Issue
  index: number
  setIssueOpened: React.Dispatch<SetStateAction<boolean>>
}

function BoardItem({
  item: issue,
  index,
  setIssueOpened,
}: BoardItemProps): JSX.Element {
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
          <UnstyledButton onClick={handleClick}>
            <Text>{issue.title}</Text>
            <Group className={classes.issueStatus}>
              <ThemeIcon size="sm" variant="light">
                <IssueTypeIcon issueType={issue.type} />
              </ThemeIcon>
              <Text>Issue {issue.id}</Text>
              <IssueStoryPointsDisplay storyPoints={issue.storyPoints} />
            </Group>
          </UnstyledButton>
        </div>
      )}
    </Draggable>
  )
}

export default BoardItem
