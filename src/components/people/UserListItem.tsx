import { Avatar, Card, createStyles, Stack, Text } from '@mantine/core'
import { User } from '../../services/types'

const useStyles = createStyles((theme) => ({
  card: {
    width: theme.other.cardWidth,
    height: theme.other.cardHeight,
  },
}))

interface UserListItemProps {
  user: User
}
export default function UserListItem({ user }: UserListItemProps) {
  const { classes } = useStyles()

  return (
    <Card withBorder shadow="sm" radius="md" className={classes.card}>
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
