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
import TeamGetAvatars from './TeamGetAvatars'
import TeamUpdateModal from './TeamUpdateModal'

const useStyles = createStyles((theme) => ({
  card: {
    width: theme.other.cardWidth,
    height: theme.other.cardHeight,
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

  const count = team ? team.users?.length : 3

  return (
    <>
      <Card withBorder shadow="sm" radius="md" className={classes.card}>
        {team && (
          <div className={classes.dotMenu}>
            <DotMenu
              setEditOpened={setEditOpened}
              setDeleteOpened={setDeleteOpened}
            />
          </div>
        )}
        <Stack align="center" justify="center">
          <TeamGetAvatars
            numAvatars={count}
            team={team}
            seed={seed}
            avatarSize="lg"
          />
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
        <>
          <TeamUpdateModal
            teamId={team.id}
            opened={editOpened}
            setOpened={setEditOpened}
          />
          <TeamDeleteModal
            teamId={team.id}
            opened={deleteOpened}
            setOpened={setDeleteOpened}
          />
        </>
      )}
    </>
  )
}
