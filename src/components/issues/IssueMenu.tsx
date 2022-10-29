import {
  ActionIcon,
  Button,
  createStyles,
  Group,
  Menu,
  Modal,
  Text,
  Title,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  IconAlertTriangle,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconX,
} from '@tabler/icons'
import { useState } from 'react'
import { useDeleteIssueMutation } from '../../services/issuesEndpoints'
import DotMenu from '../common/DotMenu'
import DeleteModal from '../common/modals/DeleteModal'

const useStyles = createStyles((theme) => ({
  container: {
    marginLeft: 'auto',
    marginRight: '2rem',
  },

  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface IssueMenuProps {
  issueId: number
  onClose: () => void
}

export default function IssueMenu({ issueId, onClose }: IssueMenuProps) {
  const { classes } = useStyles()
  const [deleteIssue] = useDeleteIssueMutation()
  const [deleteOpened, setDeleteOpened] = useState(false)

  const handleDelete = async () => {
    try {
      onClose()
      await deleteIssue(issueId).unwrap()
      setDeleteOpened(false)
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Issue could not be deleted.',
        autoClose: 4000,
        color: 'red',
        icon: <IconX />,
      })
    }
  }

  return (
    <nav className={classes.container}>
      <DotMenu setDeleteOpened={setDeleteOpened} />
      {/* <DeleteModal
        item={issue}
        deleteMutation={deleteIssue}
        opened={deleteOpened}
        setOpened={setDeleteOpened}
      /> */}
    </nav>
  )
}
