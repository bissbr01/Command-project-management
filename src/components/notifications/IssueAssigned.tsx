import { Stack, Text } from '@mantine/core'
import { Notification } from '../../services/types'

interface IssueAssignedProps {
  notification: Notification
}

export default function IssueAssigned({ notification }: IssueAssignedProps) {
  return (
    <>
      <Text>Issue Assigned</Text>
      <Text>
        {notification.colleague?.nickname} has assigned you an issue. Visit your
        project to learn more.
      </Text>
    </>
  )
}
