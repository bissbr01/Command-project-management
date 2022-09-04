import {
  Drawer,
  createStyles,
  useMantineTheme,
  ActionIcon,
  Affix,
  Transition,
} from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconChevronsRight } from '@tabler/icons'
import SideNav from './SideNav'

const useStyles = createStyles((theme) => ({
  drawer: {
    background: theme.colors.gray[0],
  },
}))

function SideNavContainer() {
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()
  const minScreenLarge = useMediaQuery(`(min-width: ${theme.breakpoints.lg}px)`)
  const { classes } = useStyles()

  if (minScreenLarge) return <SideNav />

  return (
    <>
      <Drawer
        closeButtonLabel="Close drawer"
        opened={opened}
        onClose={() => close()}
        overlayColor={
          theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.3}
        overlayBlur={1}
        // title="Project Name"
        // padding="xs"
        size={300}
        classNames={{ drawer: classes.drawer }}
      >
        <SideNav />
      </Drawer>
      <Affix position={{ left: 0, top: 400 }}>
        <Transition transition="slide-left" mounted={!opened}>
          {(transitionStyles) => (
            <ActionIcon
              color="teal"
              size="lg"
              variant="filled"
              style={transitionStyles}
            >
              <IconChevronsRight size={26} onClick={() => open()} />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
    </>
  )
}

export default SideNavContainer
