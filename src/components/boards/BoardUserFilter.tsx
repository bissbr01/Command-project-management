import {
  Avatar,
  Chip,
  createStyles,
  Group,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Team, User, UsersById } from '../../services/types'

const useStyles = createStyles((theme) => ({
  avatar: {
    background: 'transparent',
    border: 'none',
  },

  button: {
    borderRadius: theme.radius.xl,
    padding: 2,
  },
}))

interface BoardUserFilterProps {
  team: Team
  handleClick: (users: UsersById) => void
}

export default function BoardUserFilter({
  team,
  handleClick,
}: BoardUserFilterProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [users, setUsers] = useState<UsersById>({})

  const updateUsers = (user: User) => {
    let filteredUsers = {}
    if (user.id in users) {
      filteredUsers = _.omit(users, user.id)
      setUsers(filteredUsers)
    } else {
      filteredUsers = { ...users, [user.id]: user }
      setUsers(filteredUsers)
    }
    console.log('users:', filteredUsers)
    handleClick(filteredUsers)
  }

  return (
    <Group mb="1rem">
      {team.users?.map((user) => (
        <UnstyledButton
          key={user.id}
          onClick={() => updateUsers(user)}
          className={classes.button}
          sx={{
            background: user.id in users ? theme.colors.blue[5] : 'none',
          }}
        >
          <Avatar
            alt="teammate avatar"
            src={user.picture}
            size="md"
            radius="xl"
            className={classes.avatar}
          >
            {user.nickname}
          </Avatar>
        </UnstyledButton>
      ))}
    </Group>
  )
}
