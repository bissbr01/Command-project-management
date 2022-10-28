import { Avatar, Card, createStyles, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { User } from '../../services/types'
import DotMenu from '../common/DotMenu'
import ColleagueDeleteModal from './ColleagueDeleteModal'

const useStyles = createStyles((theme) => ({
  card: {
    width: theme.other.cardWidth,
    height: theme.other.cardHeight,
  },

  dotMenu: {
    position: 'absolute',
    top: 15,
    right: 5,
  },
}))

interface UserListItemProps {
  user: User
  me: User
}
export default function UserListItem({ user, me }: UserListItemProps) {
  const { classes } = useStyles()
  const [deleteOpened, setDeleteOpened] = useState(false)

  return (
    <>
      <Card withBorder shadow="sm" radius="md" className={classes.card}>
        {user && user.id !== me.id && (
          <div className={classes.dotMenu}>
            <DotMenu setDeleteOpened={setDeleteOpened} />
          </div>
        )}
        <Stack align="center">
          <Avatar
            src={user.picture}
            alt={user.nickname}
            size="lg"
            color="blue"
            radius="xl"
          >
            {user.nickname}
          </Avatar>
          <Text size="md">{user.nickname}</Text>
          <Text size="sm" color="dimmed">
            {user.email}
          </Text>
        </Stack>
      </Card>
      <ColleagueDeleteModal
        colleagueId={user.id}
        opened={deleteOpened}
        setOpened={setDeleteOpened}
      />
    </>
  )
}
