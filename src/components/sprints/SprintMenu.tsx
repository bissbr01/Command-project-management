import { ActionIcon, createStyles, Menu } from '@mantine/core'
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons'
import { useState } from 'react'
import { Sprint } from '../../services/types'
import SprintDeleteModal from './SprintDeleteModal'
import SprintEditModal from './SprintEditModal'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface SprintMenuProps {
  sprint: Sprint
  setEditOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SprintMenu({ sprint, setEditOpened }: SprintMenuProps) {
  const [deleteOpened, setDeleteOpened] = useState(false)

  return (
    <nav>
      <Menu width={200} position="bottom-end">
        <Menu.Target>
          <ActionIcon size="sm">
            <IconDotsVertical />
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
      <SprintDeleteModal
        sprintId={sprint.id}
        opened={deleteOpened}
        setOpened={setDeleteOpened}
      />
    </nav>
  )
}
