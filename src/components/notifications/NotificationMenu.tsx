import { Box, Image, Indicator, Menu, Stack, Text, Title } from '@mantine/core'
import { IconBellRinging } from '@tabler/icons'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import LoadingCircle from '../common/LoadingCircle'
import Notification from './Notification'
import noMoreNotifications from '../../no-more-notifications.png'

export default function NotificationMenu() {
  const { data: me } = useGetUserByTokenQuery()

  if (!me) return <LoadingCircle />

  return (
    <Menu shadow="md" width={350} position="bottom-end">
      <Menu.Target>
        <span>
          <Indicator
            disabled={!me.notifications || me.notifications.length === 0}
          >
            <IconBellRinging />
          </Indicator>
        </span>
      </Menu.Target>

      <Menu.Dropdown>
        <Title m="md" align="left" order={2} size="h4">
          Notifications
        </Title>
        {me.notifications && me.notifications.length > 0 ? (
          me.notifications.map((notification) => (
            <Notification notification={notification} />
          ))
        ) : (
          <Box p="xl">
            <Stack align="center">
              <Image height={200} width="auto" src={noMoreNotifications} />
            </Stack>
            <Text size="md" m="md" align="center">
              You have no notifications to display.
            </Text>
          </Box>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}
