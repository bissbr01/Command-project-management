import { ActionIcon, Avatar, Group, Menu, Text } from '@mantine/core'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Project } from '../../services/types'
import TeamGetAvatars from '../people/TeamGetAvatars'
import ProjectDeleteModal from './ProjectDeleteModal'
import ProjectEditModal from './ProjectEditModal'

interface ProjectListItemProps {
  project: Project
}
export default function ProjectListItem({ project }: ProjectListItemProps) {
  const [editOpened, setEditOpened] = useState(false)
  const [deleteOpened, setDeleteOpened] = useState(false)

  return (
    <tr key={project.id}>
      <td>
        <Link to={`/projects/${project.id}/board`}>{project.title}</Link>
      </td>
      <td>
        <Text>{project.sprints?.length}</Text>
      </td>
      <td>
        <Group>
          <TeamGetAvatars
            numAvatars={project.team?.users?.length}
            team={project.team}
            seed={15}
            avatarSize="md"
          />
          <Text>{project.team?.name}</Text>
        </Group>
      </td>
      <td>
        <Group>
          <Avatar
            src={project.lead?.picture}
            alt={project.lead?.nickname}
            size="md"
            color="blue"
            radius="xl"
          >
            <Text>{project.lead?.nickname}</Text>
          </Avatar>
          <Text>{project.lead?.nickname}</Text>
        </Group>
      </td>
      <td>
        <Menu>
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
        <ProjectEditModal
          project={project}
          opened={editOpened}
          setOpened={setEditOpened}
        />
        <ProjectDeleteModal
          projectId={project.id}
          opened={deleteOpened}
          setOpened={setDeleteOpened}
        />
      </td>
    </tr>
  )
}
