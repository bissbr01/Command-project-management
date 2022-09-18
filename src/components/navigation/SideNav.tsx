/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import { createStyles, Navbar, Menu } from '@mantine/core'
import {
  IconBellRinging,
  IconSettings,
  IconUserCircle,
  IconLogout,
  IconStack2,
  IconChalkboard,
} from '@tabler/icons'
import { useNavigate } from 'react-router-dom'
import UserButton from './UserButton'
import { RootState } from '../../store'
import { removeLogin } from '../../reducers/authentication'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'

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

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
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

const data = [
  { link: '', label: 'Notifications', icon: IconBellRinging },
  { link: '', label: 'Backlog', icon: IconStack2 },
  { link: '', label: 'Board', icon: IconChalkboard },
  { link: '', label: 'Settings', icon: IconSettings },
]

function SideNav({ width }: { width: number }) {
  const { classes, cx } = useStyles()
  const [active, setActive] = useState('Billing')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  // const selectAuth = (state: RootState) => state.auth
  // const auth: Auth = useAppSelector(selectAuth)

  const handleLogout = () => {
    dispatch(removeLogin())
    navigate('/login')
  }

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault()
        setActive(item.label)
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ))

  return (
    <Navbar width={{ sm: width }} p="md" className={classes.container}>
      <Navbar.Section grow>{links}</Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {/* {auth.user && ( */}
        <Menu position="top" withArrow width={200}>
          <Menu.Target>
            {/* <UserButton
                image="default picture"
                name={auth.user.fullName ?? 'no name'}
                email={auth.user.email ?? 'no email'}
              /> */}
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
        {/* )} */}
      </Navbar.Section>
    </Navbar>
  )
}

export default SideNav
