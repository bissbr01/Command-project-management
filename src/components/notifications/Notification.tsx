import {
  ActionIcon,
  Avatar,
  CloseButton,
  createStyles,
  Group,
  useMantineTheme,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import dayjs from 'dayjs'
import { useUpdateNotificationMutation } from '../../services/notificationsEndpoints'
import {
  assertUnreachable,
  Notification as NotificationInterface,
  NotificationStatus,
  NotificationType,
} from '../../services/types'
import { useAddColleagueMutation } from '../../services/usersEndpoints'
import ColleagueConfirmed from './ColleagueConfirmed'
import ColleagueRequest from './ColleagueRequest'
import IssueAssigned from './IssueAssigned'

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
  const [addColleague] = useAddColleagueMutation()

  const handleAccept = async () => {
    if (!notification.colleague) return
    try {
      await addColleague({ email: notification.colleague.email }).unwrap()
      await updateNotification({
        id: notification.id,
        status: NotificationStatus.Archive,
      }).unwrap()
      showNotification({
        title: 'Success',
        message: 'Colleague Added',
        autoClose: 4000,
        color: 'green',
        icon: <IconCheck />,
      })
    } catch (e: unknown) {
      showNotification({
        title: 'Error',
        message: 'We were unable to add this colleague.  Sorry.',
        autoClose: 4000,
        color: 'red',
        icon: <IconX />,
      })
    }
  }
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
        return <ColleagueConfirmed notification={notification} />
      case NotificationType.IssueAssigned:
        return <IssueAssigned notification={notification} />
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
      {displayByType()}
      <Group className={classes.buttons}>
        {notification.type === NotificationType.ColleagueRequest && (
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
        )}
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
