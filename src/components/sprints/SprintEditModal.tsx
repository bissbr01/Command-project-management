import { createStyles, Title, Button, Modal, Text, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import { useUpdateSprintMutation } from '../../services/sprintsEndpoints'
import { Sprint } from '../../services/types'
import DatePickerField from '../common/forms/DatePickerField'
import NumberField from '../common/forms/NumberField'
import TextAreaField from '../common/forms/TextAreaField'

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
  const [update] = useUpdateSprintMutation()

  const SprintEditModalSchema = Yup.object().shape({
    goal: Yup.string(),
    startOn: Yup.date(),
    endOn: Yup.date(),
  })

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={<Title order={2}>Edit Sprint {sprint.id}</Title>}
    >
      <Formik
        initialValues={{
          goal: sprint.goal ?? '',
          startOn: sprint.startOn ? new Date(sprint.startOn) : new Date(),
          endOn: sprint.endOn ? new Date(sprint.endOn) : new Date(),
        }}
        validationSchema={SprintEditModalSchema}
        onSubmit={async (values) => {
          try {
            await update({
              id: sprint.id,
              ...values,
              startOn: values.startOn.toString(),
            })
            setOpened(false)
            showNotification({
              title: 'Success',
              message: 'Sprint successfully saved.',
              autoClose: 4000,
              color: 'green',
              icon: <IconCheck />,
            })
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
        {({ isSubmitting }) => (
          <Form className={classes.container}>
            <Field
              stylesApi={{ input: cx(classes.inputStyles) }}
              id="goal"
              name="goal"
              minRows={2}
              label={<Text>Goal</Text>}
              component={TextAreaField}
            />
            <Field
              stylesApi={{ input: cx(classes.inputStyles) }}
              id="startOn"
              name="startOn"
              placeholder="Pick start date..."
              label={<Text>Start On</Text>}
              component={DatePickerField}
            />
            <Field
              stylesApi={{ input: cx(classes.inputStyles) }}
              id="endOn"
              name="endOn"
              placeholder="Pick end date..."
              label={<Text>End On</Text>}
              component={DatePickerField}
            />
            <Group position="center">
              <Button type="submit" disabled={isSubmitting}>
                Update
              </Button>
              <Button
                onClick={() => setOpened(false)}
                disabled={isSubmitting}
                variant="default"
              >
                Cancel
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
