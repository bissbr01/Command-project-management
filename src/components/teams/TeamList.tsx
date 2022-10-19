import {
  ActionIcon,
  Box,
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
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import UserListItem from './UserListItem'

const useStyles = createStyles((theme) => ({
  createButton: {
    margin: '0 1rem 0 auto',
  },
}))

export default function TeamList() {
  const { data: user } = useGetUserByTokenQuery()
  const [createOpened, setCreateOpened] = useState(false)
  const [editOpened, setEditOpened] = useState(false)
  const [deleteOpened, setDeleteOpened] = useState(false)
  const { classes } = useStyles()

  if (!user || !user.teams) return <Loader />

  return (
    <main>
      <Group>
        <Title my="md">Teams</Title>
        <Box className={classes.createButton}>
          {/* <ProjectCreateButton setOpened={setCreateOpened} /> */}
        </Box>
      </Group>
      {user.teams.map((team) => (
        <section key={team.id}>
          <Group>
            <Title order={2}>{team.name}</Title>
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon>
                  <IconDots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => setEditOpened(true)}
                  icon={<IconEdit size={16} />}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  onClick={() => setDeleteOpened(true)}
                  color="red"
                  icon={<IconTrash size={16} />}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Group>
            {team.users?.map((nestedUser) => (
              <UserListItem user={nestedUser} key={nestedUser.id} />
            ))}
          </Group>
        </section>
      ))}
      {/* <ProjectCreateModal opened={createOpened} setOpened={setCreateOpened} /> */}
    </main>
  )
}
