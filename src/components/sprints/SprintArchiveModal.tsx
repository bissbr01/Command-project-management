import { Button, createStyles, Group, Modal, Text, Title } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons'
import {
  useDeleteSprintMutation,
  useUpdateSprintMutation,
} from '../../services/sprintsEndpoints'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.orange[6],
    marginRight: '1rem',
  },
}))

interface SprintArchiveModalProps {
  sprintId: number
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SprintArchiveModal({
  sprintId,
  opened,
  setOpened,
}: SprintArchiveModalProps) {
  const { classes } = useStyles()
  const [updateSprint] = useUpdateSprintMutation()

  const handleArchive = async () => {
    setOpened(false)
    await updateSprint({ id: sprintId, active: false, displayOnBoard: false })
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Title order={3}>
          <IconAlertTriangle className={classes.icon} />
          Archive Sprint {sprintId}?
        </Title>
      }
    >
      <Text component="p">
        You are about to archive this sprint, its issues and comments, and all
        of its data. If you are not sure, you can close this sprint instead.
      </Text>
      <Group position="right">
        <Button onClick={handleArchive} color="orange">
          Archive
        </Button>
        <Button onClick={() => setOpened(false)} variant="default">
          Cancel
        </Button>
      </Group>
    </Modal>
  )
}
