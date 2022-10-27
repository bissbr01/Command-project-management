import { createStyles, Title, Modal, Button, Text, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Project } from '../../services/types'
import { useUpdateProjectMutation } from '../../services/projectsEndpoints'
import TextField from '../common/forms/TextField'
import ProjectTeamSelectField from './ProjectTeamSelectField'
import ProjectLeadSelectField from './ProjectLeadSelectField'

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

export interface ProjectEditModalProps {
  project: Project
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ProjectEditModal({
  project,
  opened,
  setOpened,
}: ProjectEditModalProps) {
  const [updateProject] = useUpdateProjectMutation()
  const { classes, cx } = useStyles()

  const ProjectEditModalSchema = Yup.object().shape({
    title: Yup.string().required('Your project must have a title'),
    lead: Yup.string(),
  })

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={<Title order={2}>Edit {project.title}</Title>}
    >
      <Formik
        initialValues={{
          title: project.title,
          teamId: String(project.teamId),
          leadId: project.leadId,
        }}
        validationSchema={ProjectEditModalSchema}
        onSubmit={async ({ title, leadId, teamId }) => {
          try {
            setOpened(false)
            await updateProject({
              id: project.id,
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
              message: 'Project could not be updated.',
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
