import { Container, Loader, Tabs, Title } from '@mantine/core'
import { IconUser, IconUserCircle, IconUsers } from '@tabler/icons'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import LoadingCircle from '../common/LoadingCircle'

export default function NotificationLayout() {
  const { data: me, error } = useGetUserByTokenQuery()
  const seed = Math.random()

  if (!me) return <LoadingCircle />
  if (error)
    return (
      <p>Sorry, there was a problem fetching your data. Please try again.</p>
    )

  return (
    <Container>
      <main>
        <Title py="lg">Notifications</Title>
        {
          me.notifications?.map((notification) => ({
            <NotificationListItem />
          }))
        }
      </main>
    </Container>
  )
}
