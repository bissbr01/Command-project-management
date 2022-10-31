import { Avatar, createStyles } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import { useGetProjectByIdQuery } from '../../services/projectsEndpoints'
import { Issue } from '../../services/types'
import FormikSubmitOnChange from '../common/forms/FormikSubmitOnChange'
import SelectField from '../common/forms/SelectField'
import LoadingCircle from '../common/LoadingCircle'
import UserAssignSelectItem from '../common/forms/UserSelectItem'

const useStyles = createStyles((theme) => ({
  form: {
    // '&:hover, &:active': {
    //   background: theme.colors.gray[1],
    //   borderRadius: theme.radius.md,
    // },
  },
}))

interface IssueAssignFormProps {
  issue: Issue
}

export default function IssueAssignForm({ issue }: IssueAssignFormProps) {
  const { classes } = useStyles()
  const [update] = useUpdateIssueMutation()
  const { projectId } = useParams()
  const { data: project } = useGetProjectByIdQuery(projectId as string)

  const IssueAssignFormSchema = Yup.object().shape({
    assigneeId: Yup.string().nullable(),
  })

  if (!project) return <LoadingCircle />

  return (
    <Formik
      initialValues={{
        assigneeId: issue.assigneeId,
      }}
      validationSchema={IssueAssignFormSchema}
      onSubmit={async ({ assigneeId }) => {
        try {
          await update({
            id: issue.id,
            assigneeId: assigneeId,
          }).unwrap()
          showNotification({
            title: 'Success',
            message: 'Issue successfully saved.',
            autoClose: 4000,
            color: 'green',
            icon: <IconCheck />,
          })
        } catch (e: unknown) {
          showNotification({
            title: 'Error',
            message: 'Issue could not be updated.',
            autoClose: 4000,
            color: 'red',
            icon: <IconX />,
          })
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={classes.form}>
          <FormikSubmitOnChange />
          <Field
            id="assigneeId"
            name="assigneeId"
            label="Assigned to:"
            // variant="unstyled"
            placeholder="Assign to Teammate"
            itemComponent={UserAssignSelectItem}
            size="sm"
            icon={
              <Avatar
                src={issue.assignee?.picture}
                alt={issue.assignee?.nickname}
                size="sm"
                color="blue"
                radius="xl"
              >
                {issue.assignee?.nickname}
              </Avatar>
            }
            data={project.team?.users?.map((user) => ({
              value: user.id,
              label: user.nickname,
              picture: user.picture,
            }))}
            component={SelectField}
            disabled={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  )
}
