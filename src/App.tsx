import { Container, createStyles, Group } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import SideNavContainer from './components/navigation/SideNavContainer'
import TopNav from './components/navigation/TopNav'

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    alignSelf: 'flex-start',
  },

  group: {
    alignItems: 'flex-start',
  },

  title: {
    margin: '.5em 0',
    color: theme.colors.gray[8],
    textAlign: 'center',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      textAlign: 'left',
    },
  },
  sprintItems: {
    margin: '.5em 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
    },
  },
  sprintButton: {},
}))

function App() {
  const { classes } = useStyles()

  return (
    <div>
      <TopNav />
      <Group className={classes.group}>
        <SideNavContainer />
        <Container className={classes.container} size="xl">
          {/* <NavBreadcrumbs /> */}
          <Outlet />
        </Container>
      </Group>
    </div>
  )
}

export default App
