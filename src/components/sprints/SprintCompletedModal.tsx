import { Modal } from '@mantine/core'
import { SetStateAction } from 'react'
import { useParams } from 'react-router-dom'
import SprintCompleted from './SprintCompleted'

export interface SprintCompletedModalProps {
  opened: boolean
  setOpened: React.Dispatch<SetStateAction<boolean>>
  redirectUrl?: string
}

export default function SprintCompletedModal({
  opened,
  setOpened,
  redirectUrl = '/',
}: SprintCompletedModalProps) {
  const { sprintId } = useParams()

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
    >
      {sprintId && (
        <SprintCompleted
          sprintId={sprintId}
          setOpened={setOpened}
          redirectUrl={redirectUrl}
        />
      )}
    </Modal>
  )
}
