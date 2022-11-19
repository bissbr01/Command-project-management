import {
  assertUnreachable,
  Notification as NotificationInterface,
  NotificationType,
} from '../../services/types'
import ColleagueRequest from './ColleagueRequest'

interface NotificationProps {
  notification: NotificationInterface
}

export default function Notification({ notification }: NotificationProps) {
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
  return displayByType()
}
