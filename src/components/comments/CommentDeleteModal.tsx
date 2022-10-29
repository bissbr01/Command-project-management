import { Button, createStyles, Group, Modal, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconAlertTriangle, IconX } from '@tabler/icons'
import { useDeleteCommentMutation } from '../../services/commentsEndpoints'
import { useDeleteProjectMutation } from '../../services/projectsEndpoints'
import { Comment } from '../../services/types'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface CommentDeleteModalProps {
  comment: Comment
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CommentDeleteModal({
  comment,
  opened,
  setOpened,
}: CommentDeleteModalProps) {
  const { classes } = useStyles()
  const [deleteComment] = useDeleteCommentMutation()

  const handleDelete = async () => {
    try {
      setOpened(false)
      await deleteComment(comment.id).unwrap()
    } catch (e: unknown) {
      showNotification({
        title: 'Error',
        message: 'Comment could not be deleted.',
        autoClose: 4000,
        color: 'red',
        icon: <IconX />,
      })
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Title order={3}>
          <IconAlertTriangle className={classes.icon} />
          Delete Comment {comment.id}?
        </Title>
      }
    >
      <Text component="p">Once you delete, it is gone for good.</Text>
      <Group position="right">
        <Button onClick={handleDelete} color="red">
          Delete
        </Button>
        <Button onClick={() => setOpened(false)} variant="default">
          Cancel
        </Button>
      </Group>
    </Modal>
  )
}
