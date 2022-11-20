import {
  ActionIcon,
  Avatar,
  CloseButton,
  createStyles,
  Group,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons'
import dayjs from 'dayjs'
import { useUpdateNotificationMutation } from '../../services/notifications'
import {
  assertUnreachable,
  Notification as NotificationInterface,
  NotificationStatus,
  NotificationType,
} from '../../services/types'
import ColleagueRequest from './ColleagueRequest'

const useStyles = createStyles(() => ({
  buttons: {
    justifyContent: 'flex-end',
    alignContent: 'flex-start',
    paddingRight: '.5rem',
    flex: '1 1 content',
    flexWrap: 'nowrap',
  },
}))

interface NotificationProps {
  notification: NotificationInterface
}

export default function Notification({ notification }: NotificationProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [updateNotification] = useUpdateNotificationMutation()

  const handleAccept = () => {}
  const handleDismiss = async () => {
    await updateNotification({
      id: notification.id,
      status: NotificationStatus.Archive,
    })
  }

  const displayByType = () => {
    switch (notification.type) {
      case NotificationType.ColleagueRequest:
        return <ColleagueRequest notification={notification} />
      case NotificationType.ColleagueConfirmed:
        return <div />
      case NotificationType.IssueAssigned:
        return <div />
      default:
        return assertUnreachable(notification.type)
    }
  }
  return (
    <Group>
      <Avatar
        src={notification.colleague?.picture}
        alt={notification.colleague?.name}
        size="md"
        color="blue"
        radius="xl"
      >
        {notification.colleague?.name}
      </Avatar>
      <Text color="dimmed">
        {dayjs(notification.createdAt).format('h:mm MMM D, YYYY')}
      </Text>
      {displayByType()}
      <Group className={classes.buttons}>
        <ActionIcon
          id="save"
          type="button"
          aria-label="save"
          // disabled={isSubmitting}
          size="sm"
          variant="filled"
          color={theme.colors.brand[1]}
          onClick={handleAccept}
        >
          <IconCheck />
        </ActionIcon>
        <CloseButton
          id="reset"
          type="button"
          aria-label="close"
          size="sm"
          variant="default"
          onClick={handleDismiss}
        />
      </Group>
    </Group>
  )
}
