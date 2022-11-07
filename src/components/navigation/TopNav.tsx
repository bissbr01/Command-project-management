import {
  createStyles,
  Header,
  useMantineTheme,
  Group,
  Burger,
  Modal,
  Box,
  NavLink,
  Loader,
} from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import LoadingCircle from '../common/LoadingCircle'
import Logo from '../common/Logo'
import NavSearch from './NavSearch'
import NavUserAvatar from './NavUserAvatar'
import UserButton from './UserButton'

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
    flexWrap: 'nowrap',
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      cursor: 'pointer',
    },
  },
}))

function TopNav(): JSX.Element {
  const [opened, { toggle, close }] = useDisclosure(false)
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const location = useLocation()
  const { data: me } = useGetUserByTokenQuery()

  const links = [
    { link: '/projects', label: 'Projects' },
    { link: '/people', label: 'People' },
  ]

  const minMediumScreen = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm}px)`
  )

  const navLinks = links.map((item) => (
    <NavLink
      className={classes.link}
      key={item.label}
      component={Link}
      label={item.label}
      to={item.link}
      active={location.pathname === item.link}
    />
  ))

  if (!me) return <LoadingCircle />

  return (
    <Header height={56} className={classes.header}>
      <div className={classes.inner}>
        <Group>
          {!minMediumScreen && (
            <>
              <Burger
                opened={opened}
                onClick={toggle}
                size="sm"
                aria-label="Open Top Navigation"
              />
              <Modal
                opened={opened}
                onClick={close}
                onClose={close}
                title="Navigation"
              >
                <Box>{navLinks.map((item) => item)}</Box>
              </Modal>
            </>
          )}
          <Logo />
        </Group>

        <Group>
          <Group ml={50} spacing={5} className={classes.links}>
            {navLinks}
          </Group>
          <Box className={classes.link}>
            <NavUserAvatar user={me} />
          </Box>
        </Group>
      </div>
    </Header>
  )
}

export default TopNav
