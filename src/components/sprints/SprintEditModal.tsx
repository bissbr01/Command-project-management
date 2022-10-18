import { createStyles, Title, Button, Modal, Text, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import * as Yup from 'yup'
import {
  useLazyGetSprintsQuery,
  useUpdateSprintMutation,
} from '../../services/sprintsEndpoints'
import { Sprint } from '../../services/types'
import CheckBoxField from '../common/forms/CheckboxField'
import DatePickerField from '../common/forms/DatePickerField'
import TextAreaField from '../common/forms/TextAreaField'
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
  const { classes, cx } = useStyles()
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
          {type === SprintEditModalType.START ? 'Start ' : 'Edit '}Sprint{' '}
          {sprintId}
        </Title>
      }
    >
      {sprintId && <SprintEdit sprintId={sprintId} setOpened={setOpened} />}
    </Modal>
  )
}
