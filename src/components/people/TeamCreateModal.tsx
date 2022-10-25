import { createStyles, Title, Modal, Button, Text, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useAddTeamMutation } from '../../services/teamsEndpoints'
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

export interface TeamCreateModalProps {
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TeamCreateModal({
  opened,
  setOpened,
}: TeamCreateModalProps) {
  const [createTeam] = useAddTeamMutation()
  const { classes, cx } = useStyles()

  const TeamCreateModalSchema = Yup.object().shape({
    name: Yup.string().required('Team must be named.'),
  })

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={<Title order={2}>Create Team</Title>}
    >
      <Formik
        initialValues={{
          name: '',
        }}
        validationSchema={TeamCreateModalSchema}
        onSubmit={async ({ name }) => {
          try {
            setOpened(false)
            await createTeam({
              name,
            })
            showNotification({
              title: 'Success',
              message: 'Team successfully saved.',
              autoClose: 4000,
              color: 'green',
              icon: <IconCheck />,
            })
          } catch (e: unknown) {
            showNotification({
              title: 'Error',
              message: 'Team could not be updated.',
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
              id="name"
              name="name"
              label={<Text>Name</Text>}
              component={TextField}
            />
            <Group position="center">
              <Button type="submit" disabled={isSubmitting}>
                Create
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
