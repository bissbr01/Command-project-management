import {
  Drawer,
  createStyles,
  useMantineTheme,
  ActionIcon,
  Affix,
  Transition,
} from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons'
import SideNav from './SideNav'

const useStyles = createStyles((theme) => ({
  drawer: {
    background: theme.colors.gray[0],
  },
  toggleButton: {
    color: theme.colors.gray[5],
    borderColor: theme.colors.gray[5],
    '&:hover': {
      color: 'white',
      backgroundColor: theme.colors.brand[4],
      borderColor: theme.colors.brand[4],
    },
  },
}))

function SideNavContainer() {
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()
  const minScreenLarge = useMediaQuery(`(min-width: ${theme.breakpoints.lg}px)`)
  const { classes } = useStyles()
  const AFFIX_HEIGHT = 160
  const SIDE_NAV_WIDTH = 250

  if (minScreenLarge) return <SideNav width={SIDE_NAV_WIDTH} />

  return (
    <>
      <Drawer
        withCloseButton={false}
        opened={opened}
        onClose={() => close()}
        overlayColor={
          theme.colorScheme === 'dark' ? theme.colors.dark[9] : 'white'
        }
        overlayOpacity={0.5}
        size={250}
        classNames={{ drawer: classes.drawer }}
        shadow="md"
      >
        <SideNav width={SIDE_NAV_WIDTH} />
      </Drawer>
      <Affix position={{ left: 0, top: AFFIX_HEIGHT }}>
        <Transition transition="slide-left" mounted={!opened}>
          {(transitionStyles) => (
            <ActionIcon
              className={classes.toggleButton}
              size="sm"
              style={transitionStyles}
              aria-label="Open Sidebar"
            >
              <IconChevronsRight size={26} onClick={() => open()} />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
      <Affix position={{ left: SIDE_NAV_WIDTH, top: AFFIX_HEIGHT }}>
        <Transition transition="slide-right" mounted={opened}>
          {(transitionStyles) => (
            <ActionIcon
              className={classes.toggleButton}
              size="sm"
              style={transitionStyles}
              aria-label="Close Sidebar"
            >
              <IconChevronsLeft size={26} onClick={() => close()} />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
    </>
  )
}

export default SideNavContainer
