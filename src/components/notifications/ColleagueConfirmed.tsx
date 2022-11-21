import { Stack, Text } from '@mantine/core'
import { Notification } from '../../services/types'

interface ColleagueConfirmedProps {
  notification: Notification
}

export default function ColleagueConfirmed({
  notification,
}: ColleagueConfirmedProps) {
  return (
    <>
      <Text>Colleage Confirmed</Text>
      <Text>
        {notification.colleague?.nickname} is now colleagues with you. Add him
        to a team to get working on a project together!
      </Text>
    </>
  )
}
