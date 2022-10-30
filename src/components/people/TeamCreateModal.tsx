import {
  createStyles,
  Title,
  Modal,
  Button,
  Text,
  Group,
  Loader,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useAddTeamMutation } from '../../services/teamsEndpoints'
import { ErrorRes } from '../../services/types'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import MultiSelectField from '../common/forms/MultiSelectField'
import TextField from '../common/forms/TextField'
import LoadingCircle from '../common/LoadingCircle'

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
  const { data: me } = useGetUserByTokenQuery()

  const TeamCreateModalSchema = Yup.object().shape({
    name: Yup.string().required('Team must be named.'),
    userIds: Yup.array().of(Yup.string()),
  })

  if (!me) return <LoadingCircle />

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={<Title order={2}>Create Team</Title>}
    >
      <Formik
        initialValues={{
          name: '',
          userIds: [],
        }}
        validationSchema={TeamCreateModalSchema}
        onSubmit={async ({ name, userIds }) => {
          try {
            setOpened(false)
            await createTeam({
              name,
              userIds,
            }).unwrap()
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
            <Field
              id="userIds"
              name="userIds"
              label={<Text>Teammates</Text>}
              data={me.friends?.map((friend) => ({
                value: friend.id.toString(),
                label: friend.name,
              }))}
              component={MultiSelectField}
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
