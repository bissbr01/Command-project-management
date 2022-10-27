import { Container, Loader, Tabs, Title } from '@mantine/core'
import { IconUser, IconUserCircle, IconUsers } from '@tabler/icons'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import ColleagueList from './ColleagueList'
import TeamList from './TeamList'

export default function PeopleLayout() {
  const { data: me, error } = useGetUserByTokenQuery()
  const seed = Math.random()

  if (!me) return <Loader />
  if (error)
    return (
      <p>Sorry, there was a problem fetching your data. Please try again.</p>
    )

  return (
    <Container>
      <main>
        <Title py="lg">People</Title>
        <Tabs defaultValue="colleagues">
          <Tabs.List>
            <Tabs.Tab value="colleagues" icon={<IconUserCircle size={16} />}>
              <Title order={2} size="h5">
                Colleagues
              </Title>
            </Tabs.Tab>
            <Tabs.Tab value="teams" icon={<IconUsers size={16} />}>
              <Title order={2} size="h5">
                Teams
              </Title>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="colleagues" pt="xs">
            <ColleagueList colleagues={me.friends} me={me} seed={seed} />
          </Tabs.Panel>
          <Tabs.Panel value="teams" pt="xs">
            <TeamList teams={me.teams} seed={seed} />
          </Tabs.Panel>
        </Tabs>
      </main>
    </Container>
  )
}
