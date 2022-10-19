import {
  Avatar,
  Card,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { User } from '../../services/types'

interface UserListItemProps {
  user: User
}
export default function UserListItem({ user }: UserListItemProps) {
  const initials = user.firstName[0] + user.lastName[0]
  return (
    <Card withBorder shadow="sm" radius="md">
      <Stack align="center">
        <Avatar
          src={null}
          alt={user.fullName}
          size="lg"
          color="blue"
          radius="xl"
        >
          {initials}
        </Avatar>
        <Text size="md">{user.fullName}</Text>
        <Text size="sm" color="dimmed">
          {user.email}
        </Text>
      </Stack>
    </Card>
  )
}
