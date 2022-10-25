import { Avatar, Button, Card, createStyles, Stack, Text } from '@mantine/core'
import { Team } from '../../services/types'
import { buildAvatarString, formatPlural } from '../../services/util'

const useStyles = createStyles((theme) => ({
  card: {
    width: theme.other.cardWidth,
    height: theme.other.cardHeight,
  },

  avatarContainer: {
    width: 100,
  },

  avatarGroup: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    // justifyContent: 'center',
  },

  avatar: {
    position: 'relative',
    top: 0,
  },
}))

export interface TeamListCardProps {
  team?: Team
  seed: number
  setCreateOpened?: React.Dispatch<React.SetStateAction<boolean>>
}
export default function TeamListCard({
  team,
  seed,
  setCreateOpened,
}: TeamListCardProps) {
  const { classes } = useStyles()

  const getAvatars = (numAvatars = 3) => {
    const avatars = []
    const aSeed = team ? team.id + seed : seed

    for (let i = 0; i < numAvatars; i += 1) {
      const style = `calc( 35px * ${-i})`
      avatars.push(
        <Avatar
          src={buildAvatarString(aSeed + i * 100)}
          alt="teammate avatar"
          size="lg"
          color="blue"
          radius="xl"
          sx={{ left: style }}
          className={classes.avatar}
          key={i}
        >
          Teammate Avatar
        </Avatar>
      )
    }
    return avatars
  }

  // const count = team ? team.users?.length : 3
  const count = 3

  return (
    <Card withBorder shadow="sm" radius="md" className={classes.card}>
      <Stack align="center" justify="center">
        <div className={classes.avatarContainer}>
          <div className={classes.avatarGroup}>
            {getAvatars(count).map((avatar) => avatar)}
          </div>
        </div>
        {team && team.users && (
          <>
            <Text size="md">{team.name}</Text>
            <Text size="sm" color="dimmed">
              {team.users?.length}
              {formatPlural(team.users.length, ' Member')}
            </Text>
          </>
        )}
        {setCreateOpened && (
          <Button onClick={() => setCreateOpened(true)}>Create Team</Button>
        )}
      </Stack>
    </Card>
  )
}
