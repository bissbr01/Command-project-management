import {
  createStyles,
  Header,
  useMantineTheme,
  Group,
  Burger,
  Modal,
  Box,
  NavLink,
} from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import Logo from '../common/Logo'
import NavSearch from './NavSearch'

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    // boxShadow,
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
    },
  },
}))

interface TopNavProps {
  links: { link: string; label: string }[]
}

function TopNav({ links }: TopNavProps): JSX.Element {
  const [opened, { toggle, close }] = useDisclosure(false)
  const { classes } = useStyles()
  const theme = useMantineTheme()

  const minMediumScreen = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm}px)`
  )

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </a>
  ))

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
              <Modal opened={opened} onClose={close} title="Navigation">
                <Box>
                  {links.map((link) => (
                    <NavLink key={link.link} label={link.label} />
                  ))}
                  <NavSearch />
                </Box>
              </Modal>
            </>
          )}
          <Logo />
        </Group>

        <Group>
          <Group ml={50} spacing={5} className={classes.links}>
            {items}
          </Group>
          <NavSearch />
        </Group>
      </div>
    </Header>
  )
}

export default TopNav
