import { Button, createStyles, Group, Modal, Text, Title } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons'
import { useDeleteSprintMutation } from '../../services/sprintsEndpoints'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface SprintDeleteModalProps {
  sprintId: number
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SprintDeleteModal({
  sprintId,
  opened,
  setOpened,
}: SprintDeleteModalProps) {
  const { classes } = useStyles()
  const [deleteSprint] = useDeleteSprintMutation()

  const handleDelete = async () => {
    setOpened(false)
    await deleteSprint(sprintId)
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Title order={3}>
          <IconAlertTriangle className={classes.icon} />
          Delete Sprint {sprintId}?
        </Title>
      }
    >
      <Text component="p">
        You are about to permanently delete this sprint, its issues and
        comments, and all of its data. If you are not sure, you can close this
        sprint instead.
      </Text>
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
