/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import { createStyles, Navbar, Menu, Loader, NavLink } from '@mantine/core'
import {
  IconBellRinging,
  IconSettings,
  IconUserCircle,
  IconLogout,
  IconStack2,
  IconChalkboard,
} from '@tabler/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserButton from './UserButton'
import { removeLogin } from '../../reducers/authentication'
import { useAppDispatch } from '../../hooks/hooks'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import Logo from '../common/Logo'

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon')
  return {
    container: {
      backgroundColor: theme.colors.gray[0],
      marginRight: 0,
    },

    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({
          variant: 'light',
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  }
})

const navData = [
  { link: '/', label: 'Board', icon: IconChalkboard },
  { link: '/backlog', label: 'Backlog', icon: IconStack2 },
  { link: '/notifications', label: 'Notifications', icon: IconBellRinging },
  { link: '/settings', label: 'Settings', icon: IconSettings },
]

interface SideNavProps {
  width: number
  close: () => void
}

function SideNav({ width, close }: SideNavProps) {
  const { classes } = useStyles()
  const [active, setActive] = useState('/')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { data: user, isLoading } = useGetUserByTokenQuery()
  const location = useLocation()

  useEffect(() => {
    setActive(location.pathname)
  }, [setActive, location])

  const handleLogout = () => {
    dispatch(removeLogin())
    navigate('/login')
  }

  const navLinks = navData.map((item) => (
    <NavLink
      // className={cx(classes.link, {
      //   [classes.linkActive]: item.label === active,
      // })}
      key={item.label}
      active={item.link === active}
      component={Link}
      label={item.label}
      to={item.link}
      icon={<item.icon className={classes.linkIcon} stroke={1.5} />}
      // variant="subtle"
      onClick={() => {
        setActive(item.link)
        close()
      }}
    />
  ))

  if (isLoading) return <Loader />
  if (!user) return <div>No user found</div>

  return (
    <Navbar width={{ sm: width }} p="md" className={classes.container}>
      <Navbar.Section className={classes.header}>
        {/* <Logo /> */}
        <Menu position="top" withArrow width={200}>
          <Menu.Target>
            <UserButton
              image="default picture"
              name={user.fullName ?? 'no name'}
              email={user.email ?? 'no email'}
            />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconUserCircle size={14} />}>Profile</Menu.Item>
            <Menu.Item
              icon={<IconLogout size={14} />}
              onClick={() => handleLogout()}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Navbar.Section>

      <Navbar.Section grow>{navLinks}</Navbar.Section>
    </Navbar>
  )
}

export default SideNav
