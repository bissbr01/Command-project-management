import { createStyles, MantineSize, ThemeIcon } from '@mantine/core'
import { IconBookmark, IconBug, IconCheckbox } from '@tabler/icons'
import { assertUnreachable, IssueType } from '../../services/types'

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

export interface IssueTypeIconProps {
  issueType: IssueType
  size?: MantineSize
}

export default function IssueTypeIcon({
  issueType,
  size = 'sm',
}: IssueTypeIconProps): JSX.Element {
  const { classes } = useStyles()

  const getTypeIcon = (type: IssueType) => {
    switch (type) {
      case IssueType.Bug:
        return (
          <ThemeIcon variant="filled" size={size} className={classes.bug}>
            <IconBug />
          </ThemeIcon>
        )
      case IssueType.Task:
        return (
          <ThemeIcon variant="filled" size={size} className={classes.task}>
            <IconCheckbox />
          </ThemeIcon>
        )
      case IssueType.UserStory:
        return (
          <ThemeIcon variant="filled" size={size} className={classes.userStory}>
            <IconBookmark />
          </ThemeIcon>
        )
      default:
        return assertUnreachable(type)
    }
  }

  return getTypeIcon(issueType)
}
