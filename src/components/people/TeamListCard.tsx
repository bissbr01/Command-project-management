import { Avatar, Card, createStyles, Stack, Text } from '@mantine/core'
import { Team } from '../../services/types'
import { buildAvatarString } from '../../services/util'

const useStyles = createStyles((theme) => ({
  avatarGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
}))

interface TeamListCardProps {
  team: Team
  seed: number
}
export default function TeamListCard({ team, seed }: TeamListCardProps) {
  return (
    <Card withBorder shadow="sm" radius="md">
      <Stack align="center">
        <div>
          <Avatar
            src={buildAvatarString(seed + 10)}
            alt={team.name}
            size="lg"
            color="blue"
            radius="xl"
          >
            {team.name}
          </Avatar>
          <Avatar
            src={buildAvatarString(seed + 20)}
            alt={team.name}
            size="lg"
            color="blue"
            radius="xl"
          >
            {team.name}
          </Avatar>
          <Avatar
            src={buildAvatarString(seed + 30)}
            alt={team.name}
            size="lg"
            color="blue"
            radius="xl"
          >
            {team.name}
          </Avatar>
        </div>
        <Text size="md">{team.name}</Text>
        <Text size="sm" color="dimmed">
          {team.users?.length}
        </Text>
      </Stack>
    </Card>
  )
}
