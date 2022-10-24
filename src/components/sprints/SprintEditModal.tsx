import { createStyles, Title, Modal } from '@mantine/core'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import SprintEdit from './SprintEdit'

const useStyles = createStyles((theme) => ({
  container: {
    marginBottom: '1rem',
    '& .mantine-InputWrapper-root': {
      marginBottom: '1rem',
    },
  },

  inputStyles: {
    padding: 10,
    '&:hover': {
      backgroundColor: theme.colors.gray[1],
    },
    '&:focus': {
      border: `2px solid ${theme.colors.brand[1]}`,
      borderRadius: 5,
      '&:hover': {
        backgroundColor: theme.white,
      },
    },
  },

  save: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export enum SprintEditModalType {
  START = 'start',
  EDIT = 'edit',
}

export interface SprintEditModalProps {
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SprintEditModal({
  opened,
  setOpened,
}: SprintEditModalProps) {
  const { sprintId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleClose = () => {
    navigate(-1)
    setOpened(false)
  }

  const type = searchParams.get('type')

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Title order={2}>
          {type === SprintEditModalType.START ? 'Start ' : 'Edit '}Sprint
        </Title>
      }
    >
      {sprintId && <SprintEdit sprintId={sprintId} handleClose={handleClose} />}
    </Modal>
  )
}
