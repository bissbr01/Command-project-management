import { Notification, NotificationType } from "../../services/types"

interface NotificationProps {
  notification: Notification
}

export default function Notification({notification}: NotificationProps) {
  const displayByType = (notification: Notification) => {
    switch (notification.type) {
      case NotificationType.ColleagueRequest:
        return <ColleagueRequest notification={notification} />
    }
  } 
  return (
    
  )
} 