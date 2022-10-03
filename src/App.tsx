import { Button, Container, createStyles, Group, Title } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import Board from './components/boards/Board'
import NavBreadcrumbs from './components/common/Breadcrumbs'
import SideNavContainer from './components/navigation/SideNavContainer'
import TopNav from './components/navigation/TopNav'
import { useGetUserByTokenQuery } from './services/usersEndpoints'

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
  const { data, isLoading, error } = useGetUserByTokenQuery()

  const topNavLinks = [
    { link: 'projects', label: 'Projects' },
    { link: 'people', label: 'People' },
  ]

  if (isLoading) return <main>Loading </main>
  if (error) return <main>Error!</main>

  return (
    <div>
      <TopNav links={topNavLinks} />
      <Group className={classes.group}>
        <SideNavContainer />
        <Container className={classes.container}>
          <NavBreadcrumbs />
          <Outlet />
        </Container>
      </Group>
    </div>
  )
}

export default App
