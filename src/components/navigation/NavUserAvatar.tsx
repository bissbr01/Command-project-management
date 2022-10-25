import { useAuth0 } from '@auth0/auth0-react'
import { Avatar, Menu } from '@mantine/core'
import { IconLogout, IconUserCircle } from '@tabler/icons'
import { useAppDispatch } from '../../hooks/hooks'
import { removeLogin } from '../../reducers/authentication'
import { User } from '../../services/types'

interface NavUserAvatarProps {
  user: User
}
export default function NavUserAvatar({ user }: NavUserAvatarProps) {
  const dispatch = useAppDispatch()
  const { logout } = useAuth0()

  const handleLogout = () => {
    dispatch(removeLogin())
    logout()
  }

  return (
    <Menu position="top" withArrow width={200}>
      <Menu.Target>
        <Avatar
          src={user.picture}
          alt={user.name}
          size="md"
          color="blue"
          radius="xl"
        >
          {user.name}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<IconUserCircle size={14} />}>Profile</Menu.Item>
        <Menu.Item icon={<IconLogout size={14} />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
