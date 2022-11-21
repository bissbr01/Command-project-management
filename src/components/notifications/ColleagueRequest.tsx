import { Stack, Text } from '@mantine/core'
import { Notification } from '../../services/types'

interface ColleagueRequestProps {
  notification: Notification
}

export default function ColleagueRequest({
  notification,
}: ColleagueRequestProps) {
  return (
    <>
      <Text>Colleage Request</Text>
      <Text>
        {notification.colleague?.nickname} has requested you as a colleague on
        Command Project Mangement
      </Text>
    </>
  )
}
