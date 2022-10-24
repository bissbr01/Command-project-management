import { ActionIcon, Menu } from '@mantine/core'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Project } from '../../services/types'
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
      <td>{project.id}</td>
      <td>{project.lead?.name}</td>
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
