import { Avatar, Card, Stack, Text } from '@mantine/core'
import { User } from '../../services/types'

interface UserListItemProps {
  user: User
}
export default function UserListItem({ user }: UserListItemProps) {
  return (
    <Card withBorder shadow="sm" radius="md">
      <Stack align="center">
        <Avatar
          src={user.picture}
          alt={user.name}
          size="lg"
          color="blue"
          radius="xl"
        >
          {user.name}
        </Avatar>
        <Text size="md">{user.name}</Text>
        <Text size="sm" color="dimmed">
          {user.email}
        </Text>
      </Stack>
    </Card>
  )
}
