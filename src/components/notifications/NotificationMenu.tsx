import {
  Box,
  createStyles,
  Image,
  Indicator,
  Menu,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconBellRinging } from '@tabler/icons'
import LoadingCircle from '../common/LoadingCircle'
import Notification from './Notification'
import noMoreNotifications from '../../no-more-notifications.png'
import { useGetNotificationsQuery } from '../../services/notificationsEndpoints'

const useStyles = createStyles((theme) => ({
  dropdown: {
    midth: '100%',
    [`@media (min-width: 450px)`]: {
      width: 450,
    },
  },
}))

export default function NotificationMenu() {
  const { data: notifications } = useGetNotificationsQuery()
  const { classes } = useStyles()

  if (!notifications) return <LoadingCircle />

  return (
    <Menu
      shadow="md"
      position="bottom-end"
      classNames={{ dropdown: classes.dropdown }}
    >
      <Menu.Target>
        <span>
          <Indicator disabled={notifications.length === 0}>
            <IconBellRinging size={20} />
          </Indicator>
        </span>
      </Menu.Target>

      <Menu.Dropdown p="md">
        <Title mb="md" align="left" order={2} size="h4">
          Notifications
        </Title>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
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
