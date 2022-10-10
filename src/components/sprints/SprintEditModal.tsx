import { Button, Modal, Text } from '@mantine/core'
import { createStyles, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import { FocusEvent } from 'react'
import * as Yup from 'yup'
import { useFocused } from '../../hooks/useFocused'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import { Issue } from '../../services/types'
import FieldFocusedButtons from '../common/forms/FieldFocusedButtons'
import NumberField from '../common/forms/NumberInput'
import { Sprint } from '../../services/types'
import TextAreaField from '../common/forms/TextAreaField'

const useStyles = createStyles((theme) => ({
  container: {
    marginBottom: '1rem',
  },

  form: {},

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

interface SprintEditModalProps {
  sprint: Sprint
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SprintEditModal({
  sprint,
  opened,
  setOpened,
}: SprintEditModalProps) {
  const { classes, cx } = useStyles()
  const { focused, handleFocused } = useFocused()
  const [update] = useUpdateIssueMutation()

  const SprintEditModalSchema = Yup.object().shape({
    goal: Yup.string(),
    startOn: Yup.date(),
    length: Yup.number().min(1, 'length must be greater than 1'),
  })

  return (
    <Modal opened={opened} onClose={() => setOpened(false)}>
      <Formik
        initialValues={{
          goal: sprint.goal ?? '',
          startOn: sprint.startOn ?? Date.now(),
          length: sprint.length ?? 14,
        }}
        validationSchema={SprintEditModalSchema}
        onSubmit={async (values) => {
          try {
            await update({ id: sprint.id, ...values })
            showNotification({
              title: 'Success',
              message: 'Sprint successfully saved.',
              autoClose: 4000,
              color: 'green',
              icon: <IconCheck />,
            })
            handleFocused(false)
          } catch (e: unknown) {
            showNotification({
              title: 'Error',
              message: 'Sprint could not be updated.',
              autoClose: 4000,
              color: 'red',
              icon: <IconX />,
            })
            if (e instanceof Error) {
              console.log(e.message)
            }
          }
        }}
      >
        {({ isSubmitting, handleBlur }) => (
          <Form className={classes.container}>
            <Field
              stylesApi={{ input: cx(classes.inputStyles) }}
              id="goal"
              name="goal"
              label={<Text>Goal</Text>}
              component={TextAreaField}
            />
            <Field
              stylesApi={{ input: cx(classes.inputStyles) }}
              id="startOn"
              name="startOn"
              label={<Text>Start On</Text>}
              component={TextAreaField}
            />
            <Button type="submit">Update</Button>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
