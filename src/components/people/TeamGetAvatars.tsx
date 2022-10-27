import {
  Avatar,
  createStyles,
  MantineNumberSize,
  MantineSizes,
  MANTINE_SIZES,
} from '@mantine/core'
import { Team } from '../../services/types'
import { buildAvatarString } from '../../services/util'

const useStyles = createStyles((theme) => ({
  avatar: {
    background: 'transparent',
    border: 'none',
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
  const { classes } = useStyles()
  const avatars = []
  const aSeed = team ? team.id + seed : seed

  for (let i = 0; i < numAvatars; i += 1) {
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
  }
  return <Avatar.Group spacing="xl">{avatars}</Avatar.Group>
}
