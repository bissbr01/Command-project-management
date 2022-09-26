import { ThemeIcon } from '@mantine/core'
import { IconBookmark, IconBug, IconCheckbox } from '@tabler/icons'
import { assertUnreachable, IssueType } from '../../services/types'

export interface IssueTypeIconProps {
  issueType: IssueType
}

export default function IssueTypeIcon({
  issueType,
}: IssueTypeIconProps): JSX.Element {
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
    <ThemeIcon size="sm" variant="filled">
      {getTypeIcon(issueType)}
    </ThemeIcon>
  )
}
