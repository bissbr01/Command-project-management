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
import { useAddProjectMutation } from '../../services/projectsEndpoints'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import TextField from '../common/forms/TextField'
import ProjectLeadSelectField from './ProjectLeadSelectField'
import ProjectTeamSelectField from './ProjectTeamSelectField'

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

export interface ProjectCreateModalProps {
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ProjectCreateModal({
  opened,
  setOpened,
}: ProjectCreateModalProps) {
  const [createProject] = useAddProjectMutation()
  const { data: me } = useGetUserByTokenQuery()

  const { classes, cx } = useStyles()

  const ProjectCreateModalSchema = Yup.object().shape({
    title: Yup.string().required('Your project must have a title'),
    teamId: Yup.string(),
    leadId: Yup.string().required('Your project must have a lead assigned'),
  })

  if (!me) return <Loader />

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={<Title order={2}>Create Project</Title>}
    >
      <Formik
        initialValues={{
          title: '',
          leadId: '',
          teamId: '',
        }}
        validationSchema={ProjectCreateModalSchema}
        onSubmit={async ({ title, leadId, teamId }) => {
          try {
            setOpened(false)
            await createProject({
              title,
              leadId,
              teamId: teamId ? Number(teamId) : undefined,
            }).unwrap()
            showNotification({
              title: 'Success',
              message: 'Project successfully saved.',
              autoClose: 4000,
              color: 'green',
              icon: <IconCheck />,
            })
          } catch (e: unknown) {
            showNotification({
              title: 'Error',
              message: 'Project could not be created.',
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
              id="title"
              name="title"
              label={<Text>Title</Text>}
              component={TextField}
            />
            <Field
              stylesApi={{ input: cx(classes.inputStyles) }}
              id="teamId"
              name="teamId"
              label={<Text>Team</Text>}
              component={ProjectTeamSelectField}
            />
            <Field
              stylesApi={{ input: cx(classes.inputStyles) }}
              id="leadId"
              name="leadId"
              label={<Text>Lead</Text>}
              component={ProjectLeadSelectField}
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
