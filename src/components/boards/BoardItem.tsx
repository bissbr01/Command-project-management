import {
  Button,
  createStyles,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { IconBookmark, IconBug, IconCheckbox } from '@tabler/icons'
import { SetStateAction, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { NavLink, useNavigate } from 'react-router-dom'
import { assertUnreachable, Issue, IssueType } from '../../services/types'
import IssueDrawer from '../issues/IssueDrawer'

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
    navigate(`/issues/${issue.id}`)
  }

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
          <Text>{issue.title}</Text>
          <Group className={classes.issueStatus}>
            <ThemeIcon size="sm" variant="light">
              {getTypeIcon(issue.type)}
            </ThemeIcon>
            <Text>Issue {issue.id}</Text>
            <Button onClick={handleClick}>Detail</Button>
          </Group>
        </div>
      )}
    </Draggable>
  )
}

export default BoardItem
