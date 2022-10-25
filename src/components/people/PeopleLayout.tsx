import { Loader, Title } from '@mantine/core'
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
    <main>
      <Title>People</Title>
      <ColleagueList colleagues={me.friends} me={me} seed={seed} />
      <TeamList teams={me.teams} seed={seed} />
    </main>
  )
}
