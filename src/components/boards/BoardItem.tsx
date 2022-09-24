import {
  createStyles,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { IconBookmark, IconBug, IconCheckbox } from '@tabler/icons'
import { Draggable } from 'react-beautiful-dnd'
import { NavLink } from 'react-router-dom'
import { assertUnreachable, Issue, IssueType } from '../../services/types'

const useStyles = createStyles((theme) => ({
  draggable: {
    userSelect: 'none',
    padding: '1em',
    margin: '0 0 8px 0',
    minHeight: '50px',
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
}

function BoardItem({ item: issue, index }: BoardItemProps): JSX.Element {
  const { classes } = useStyles()
  const theme = useMantineTheme()

  const getTypeIcon = (type: IssueType) => {
    switch (type) {
      case IssueType.Bug:
        return <IconBug />
      case IssueType.Task:
        return <IconCheckbox />
      case IssueType.UserStory:
        return <IconBookmark />
      default:
        return assertUnreachable(type)
    }
  }

  return (
    <Draggable draggableId={String(issue.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.draggable}
          style={{
            backgroundColor: snapshot.isDragging
              ? theme.colors.brand[0]
              : 'white',
            ...provided.draggableProps.style,
          }}
        >
          <UnstyledButton>
            <Text>{issue.title}</Text>
            <Group className={classes.issueStatus}>
              <ThemeIcon size="sm" variant="light">
                {getTypeIcon(issue.type)}
              </ThemeIcon>
              <Text>Issue {issue.id}</Text>
            </Group>
          </UnstyledButton>
        </div>
      )}
    </Draggable>
  )
}

export default BoardItem
