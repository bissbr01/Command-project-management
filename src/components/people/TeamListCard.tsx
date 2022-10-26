import {
  Avatar,
  Button,
  Card,
  createStyles,
  Space,
  Stack,
  Text,
} from '@mantine/core'
import { useState } from 'react'
import { Team } from '../../services/types'
import { buildAvatarString, formatPlural } from '../../services/util'
import DotMenu from '../common/DotMenu'
import TeamDeleteModal from './TeamDeleteModal'

const useStyles = createStyles((theme) => ({
  card: {
    width: theme.other.cardWidth,
    height: theme.other.cardHeight,
  },

  avatar: {
    background: 'transparent',
    border: 'none',
  },

  dotMenu: {
    position: 'absolute',
    top: 15,
    right: 5,
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
  const [editOpened, setEditOpened] = useState(false)
  const [deleteOpened, setDeleteOpened] = useState(false)

  const getAvatars = (numAvatars = 3) => {
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
          size="lg"
          color="blue"
          radius="xl"
          key={i}
          className={classes.avatar}
        >
          Teammate Avatar
        </Avatar>
      )
    }
    return avatars
  }

  const count = team ? team.users?.length : 3

  return (
    <>
      <Card withBorder shadow="sm" radius="md" className={classes.card}>
        <div className={classes.dotMenu}>
          <DotMenu
            setEditOpened={setEditOpened}
            setDeleteOpened={setDeleteOpened}
          />
        </div>
        <Stack align="center" justify="center">
          <Avatar.Group spacing="xl">
            {getAvatars(count).map((avatar) => avatar)}
          </Avatar.Group>
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
            <>
              <Space />
              <Button onClick={() => setCreateOpened(true)}>Create Team</Button>
            </>
          )}
        </Stack>
      </Card>
      {team && (
        <TeamDeleteModal
          teamId={team.id}
          opened={deleteOpened}
          setOpened={setDeleteOpened}
        />
      )}
    </>
  )
}
