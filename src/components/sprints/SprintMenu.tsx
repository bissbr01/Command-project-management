import { ActionIcon, createStyles, Menu } from '@mantine/core'
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons'
import { useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Sprint } from '../../services/types'
import SprintDeleteModal from './SprintDeleteModal'
import { SprintEditModalType } from './SprintEdit'
import SprintEditModal from './SprintEditModal'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface SprintMenuProps {
  sprintId: number
  setEditOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SprintMenu({
  sprintId,
  setEditOpened,
}: SprintMenuProps) {
  const [deleteOpened, setDeleteOpened] = useState(false)
  const navigate = useNavigate()

  const handleEditOpen = () => {
    navigate({
      pathname: `sprint/${sprintId}`,
      search: createSearchParams({
        type: SprintEditModalType.EDIT,
      }).toString(),
    })
    setEditOpened(true)
  }

  return (
    <nav>
      <Menu width={200} position="bottom-end">
        <Menu.Target>
          <ActionIcon size="sm">
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={handleEditOpen} icon={<IconEdit size={16} />}>
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
        sprintId={sprintId}
        opened={deleteOpened}
        setOpened={setDeleteOpened}
      />
    </nav>
  )
}
