import { Avatar, createStyles, MantineNumberSize, Title } from '@mantine/core'
import { Team } from '../../services/types'
import { buildAvatarString } from '../../services/util'

const useStyles = createStyles((theme) => ({
  avatar: {
    background: 'transparent',
    border: 'none',
  },

  avatarRemainder: {
    background: theme.colors.dark[3],
    color: theme.white,
  },
}))

export interface TeamGetAvatarsProps {
  numAvatars?: number
  team?: Team
  seed: number
  avatarSize?: MantineNumberSize
}
export default function TeamGetAvatars({
  numAvatars = 3,
  team,
  seed,
  avatarSize,
}: TeamGetAvatarsProps) {
  const { classes, cx } = useStyles()
  const avatars = []
  const aSeed = team ? team.id + seed : seed

  for (let i = 0; i < numAvatars; i += 1) {
    if (i < 3) {
      avatars.push(
        <Avatar
          src={
            team && team.users
              ? team.users[i].picture
              : buildAvatarString(aSeed * 100 + i)
          }
          alt="teammate avatar"
          size={avatarSize}
          color="blue"
          radius="xl"
          key={i}
          className={classes.avatar}
        >
          Teammate Avatar
        </Avatar>
      )
    } else {
      // more than three teammates: truncate remainder into number total avatar
      avatars.push(
        <Avatar
          alt="teammate avatar"
          size={avatarSize}
          radius="xl"
          key={i}
          classNames={{ placeholder: classes.avatarRemainder }}
          className={classes.avatar}
        >
          <Title order={4} size={avatarSize === 'md' ? 'h6' : 'h4'}>
            +{numAvatars - i}
          </Title>
        </Avatar>
      )
      break
    }
  }
  return (
    <Avatar.Group spacing={avatarSize === 'md' ? 'md' : 'xl'}>
      {avatars}
    </Avatar.Group>
  )
}
