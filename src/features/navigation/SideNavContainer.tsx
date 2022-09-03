import { useState } from 'react'
import {
  Drawer,
  Group,
  Button,
  createStyles,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import SideNav from './SideNav'

const useStyles = createStyles((theme) => ({
  drawer: {
    background: theme.colors.gray[0],
  },
}))

function SideNavContainer() {
  const minScreenLarge = useMediaQuery('(min-width: 1200px)')
  const [opened, setOpened] = useState(false)
  const theme = useMantineTheme()
  const { classes } = useStyles()

  if (minScreenLarge) return <SideNav />

  return (
    <>
      <Drawer
        closeButtonLabel="Close drawer"
        opened={opened}
        onClose={() => setOpened(false)}
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
      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Drawer</Button>
      </Group>
    </>
  )
}

export default SideNavContainer
