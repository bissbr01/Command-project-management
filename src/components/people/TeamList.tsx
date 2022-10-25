import {
  ActionIcon,
  Box,
  Button,
  Card,
  createStyles,
  Group,
  Loader,
  Menu,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons'
import { useState } from 'react'
import { useGetProjectsQuery } from '../../services/projectsEndpoints'
import { Team } from '../../services/types'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import TeamCreateModal from './TeamCreateModal'
import TeamListCard from './TeamListCard'
import UserListItem from './UserListItem'

const useStyles = createStyles((theme) => ({
  createButton: {
    margin: '0 1rem 0 auto',
  },

  usersGroup: {
    // border: '1px solid gray',
    borderRadius: theme.radius.md,
    // margin: '1.5rem 0 1.5rem 0',
    padding: '1rem',
  },
}))

interface TeamListProps {
  teams: Team[] | undefined
  seed: number
}

export default function TeamList({ teams, seed }: TeamListProps) {
  const [createOpened, setCreateOpened] = useState(false)
  const [editOpened, setEditOpened] = useState(false)
  const [deleteOpened, setDeleteOpened] = useState(false)
  const { classes } = useStyles()

  if (!teams) return <Text>There are no teams to display</Text>

  return (
    <>
      <Group>
        <Title my="md" order={2}>
          Teams
        </Title>
      </Group>
      <Group>
        {teams.map((team) => (
          <TeamListCard
            team={team}
            seed={seed}
            key={team.id}
            setCreateOpened={setCreateOpened}
          />
        ))}
      </Group>
      <TeamCreateModal opened={createOpened} setOpened={setCreateOpened} />
    </>
  )
}
