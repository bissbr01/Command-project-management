import { Button, createStyles, Group, Modal, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons'
import {
  ApiMutationTrigger,
  Issue,
  Project,
  Sprint,
  Team,
  Comment,
} from '../../../services/types'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

export interface DeleteModalProps {
  item: Comment | Project | Sprint | Issue | Team
  deleteMutation: ApiMutationTrigger
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
  prompt?: string
}

export default function DeleteModal({
  item,
  deleteMutation,
  opened,
  setOpened,
  prompt = 'Once you delete it, it is gone for good.',
}: DeleteModalProps) {
  const { classes } = useStyles()

  const handleDelete = async () => {
    try {
      setOpened(false)
      await deleteMutation(item.id).unwrap()
      showNotification({
        title: 'Success',
        message: `${item.identifier} was successfully removed.`,
        autoClose: 4000,
        color: 'green',
        icon: <IconCheck />,
      })
    } catch (e: unknown) {
      showNotification({
        title: 'Error',
        message: `${item.identifier} could not be deleted.`,
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
          Delete {item.identifier}?
        </Title>
      }
    >
      <Text component="p">{prompt}</Text>
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
