import { createStyles, Title, Modal, Button, Text, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useAddNotificationMutation } from '../../services/notificationsEndpoints'
import { NotificationType } from '../../services/types'
import TextField from '../common/forms/TextField'

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

export interface ColleagueAddModalProps {
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ColleagueAddModal({
  opened,
  setOpened,
}: ColleagueAddModalProps) {
  const [addNotification] = useAddNotificationMutation()
  const { classes, cx } = useStyles()

  const ColleagueAddModalScheme = Yup.object().shape({
    email: Yup.string()
      .email('This is not a valid email')
      .required('Email is required to add colleague'),
  })

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={<Title order={2}>Invite Colleague</Title>}
    >
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={ColleagueAddModalScheme}
        onSubmit={async ({ email }) => {
          try {
            setOpened(false)
            await addNotification({
              email,
              type: NotificationType.ColleagueRequest,
            }).unwrap()
            showNotification({
              title: 'Success',
              message: 'Invitation sent',
              autoClose: 4000,
              color: 'green',
              icon: <IconCheck />,
            })
          } catch (e: unknown) {
            showNotification({
              title: 'Error',
              message: 'We were unable to send your invitation. Sorry.',
              autoClose: 4000,
              color: 'red',
              icon: <IconX />,
            })
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={classes.container}>
            <Field
              stylesApi={{ input: cx(classes.inputStyles) }}
              id="email"
              name="email"
              label={<Text>Email</Text>}
              component={TextField}
            />
            <Group position="center">
              <Button type="submit" disabled={isSubmitting}>
                Invite
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
