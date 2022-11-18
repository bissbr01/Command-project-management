import { Avatar, Button, Group, Stack, Text, Title } from '@mantine/core'
import { IconClockHour4, IconUserPlus } from '@tabler/icons'
import dayjs from 'dayjs'
import { Notification } from '../../services/types'

interface ColleagueRequestProps {
  notification: Notification
}

export default function ColleagueRequest({
  notification,
}: ColleagueRequestProps) {
  const handleAccept = () => {}

  return (
    <Group>
      <IconUserPlus />
      <Text color="dimmed">
        <IconClockHour4 />
        {dayjs(notification.createdAt).format('h:mm MMM D, YYYY')}
      </Text>
      <Stack>
        <Text>Colleage Request</Text>
        <Text>{notification.message}</Text>
      </Stack>
      <Button onClick={handleAccept}>Accept</Button>
    </Group>
  )
}
