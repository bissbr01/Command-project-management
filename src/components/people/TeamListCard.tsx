import {
  Avatar,
  Button,
  Card,
  createStyles,
  Group,
  Stack,
  Text,
} from '@mantine/core'
import { Team } from '../../services/types'
import { buildAvatarString } from '../../services/util'

const useStyles = createStyles((theme) => ({
  avatarContainer: {
    display: 'block',
  },

  avatarGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-end',
    flex: '0 1 content',
    flexWrap: 'nowrap',
  },

  avatar: {
    position: 'relative',
    top: 0,
  },
}))

interface TeamListCardProps {
  team: Team
  seed: number
  setCreateOpened: React.Dispatch<React.SetStateAction<boolean>>
}
export default function TeamListCard({
  team,
  seed,
  setCreateOpened,
}: TeamListCardProps) {
  const { classes } = useStyles()

  const getAvatars = (count = 3) => {
    const avatars = []
    for (let i = 0; i < count; i += 1) {
      avatars.push(
        <Avatar
          src={buildAvatarString(seed + i)}
          alt="teammate avatar"
          size="lg"
          color="blue"
          radius="xl"
          sx={{ left: `calc( 35% * ${-i})` }}
          className={classes.avatar}
          key={i}
        >
          Teammate Avatar
        </Avatar>
      )
    }
    return avatars
  }

  return (
    <Card withBorder shadow="sm" radius="md">
      <Stack align="center" justify="center">
        <div className={classes.avatarContainer}>
          <div className={classes.avatarGroup}>
            {getAvatars().map((avatar) => avatar)}
          </div>
        </div>
        <Text size="md">{team.name}</Text>
        <Text size="sm" color="dimmed">
          {team.users?.length}
        </Text>
        <Button onClick={() => setCreateOpened(true)} color="blue">
          Create Team
        </Button>
      </Stack>
    </Card>
  )
}
