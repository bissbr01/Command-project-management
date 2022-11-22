import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons'
import BoringAvatar from 'boring-avatars'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Project } from '../../services/types'
import TeamGetAvatars from '../people/TeamGetAvatars'
import ProjectAvatar from './ProjectAvatar'
import ProjectDeleteModal from './ProjectDeleteModal'
import ProjectEditModal from './ProjectEditModal'

interface ProjectListItemProps {
  project: Project
}
export default function ProjectListItem({ project }: ProjectListItemProps) {
  const [editOpened, setEditOpened] = useState(false)
  const [deleteOpened, setDeleteOpened] = useState(false)
  const theme = useMantineTheme()
  const minScreenSmall = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`)

  return (
    <tr key={project.id}>
      <td>
        <Link to={`/projects/${project.id}/board`}>
          <Group>
            <ProjectAvatar project={project} />
            <Text>{project.title}</Text>
          </Group>
        </Link>
      </td>
      {minScreenSmall && (
        <td>{project.sprints && <Text>{project.sprints.length - 1}</Text>}</td>
      )}
      <td>
        <Group>
          <Text>{project.team?.name ?? 'Individual Project'}</Text>
          {project.team && (
            <TeamGetAvatars
              numAvatars={project.team?.users?.length}
              team={project.team}
              seed={15}
              avatarSize="md"
            />
          )}
        </Group>
      </td>
      {minScreenSmall && (
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
      )}
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
