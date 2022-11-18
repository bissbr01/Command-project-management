import { Image, Menu, Title } from '@mantine/core'
import { IconBellRinging } from '@tabler/icons'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import LoadingCircle from '../common/LoadingCircle'
import Notification from './Notification'
import noMoreNotifications from '../../no-more-notifications.png'

export default function NotificationMenu() {
  const { data: me, error } = useGetUserByTokenQuery()

  if (!me) return <LoadingCircle />

  return (
    <Menu shadow="md" width={400} position="bottom-end">
      <Menu.Target>
        <span>
          <IconBellRinging />
        </span>
      </Menu.Target>

      <Menu.Dropdown>
        <Title order={2} size="h4">
          Notifications
        </Title>
        {me.notifications && me.notifications.length > 0 ? (
          me.notifications.map((notification) => (
            <Notification notification={notification} />
          ))
        ) : (
          <Image src={noMoreNotifications} />
        )}
      </Menu.Dropdown>
    </Menu>
  )
}
