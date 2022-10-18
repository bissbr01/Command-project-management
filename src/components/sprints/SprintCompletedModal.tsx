import { Modal } from '@mantine/core'
import { SetStateAction } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SprintCompleted from './SprintCompleted'

export interface SprintCompletedModalProps {
  opened: boolean
  setOpened: React.Dispatch<SetStateAction<boolean>>
}

export default function SprintCompletedModal({
  opened,
  setOpened,
}: SprintCompletedModalProps) {
  const { sprintId } = useParams()
  const navigate = useNavigate()

  const handleClose = () => {
    navigate(-1)
    setOpened(false)
  }

  return (
    <Modal opened={opened} onClose={handleClose} withCloseButton={false}>
      {sprintId && (
        <SprintCompleted sprintId={sprintId} handleClose={handleClose} />
      )}
    </Modal>
  )
}
