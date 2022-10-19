import { Avatar, Card, Group, Text, Title } from '@mantine/core'
import { User } from '../../services/types'

interface UserListItemProps {
  user: User
}
export default function UserListItem({ user }: UserListItemProps) {
  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Title order={3} size="h4">
            {user.fullName}
          </Title>
        </Group>
      </Card.Section>
      <Avatar src="default picture" radius="xl" />
      <Text>{user.email}</Text>
    </Card>
  )
}
