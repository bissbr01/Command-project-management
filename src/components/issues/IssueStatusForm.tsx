import { createStyles, Group, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import { Issue } from '../../services/types'
import FormikSubmitOnChange from '../common/forms/FormikSubmitOnChange'
import IssueStatusSelectField from '../common/forms/IssueStatusSelectField'

const useStyles = createStyles((theme) => ({
  form: {
    '&:hover, &:active': {
      background: theme.colors.gray[1],
      borderRadius: theme.radius.md,
    },
  },
}))

interface IssueStatusFormProps {
  issue: Issue
}

export default function IssueStatusForm({ issue }: IssueStatusFormProps) {
  const { classes } = useStyles()
  const [update] = useUpdateIssueMutation()

  const IssueStatusFormSchema = Yup.object().shape({
    type: Yup.string(),
  })

  return (
    <Formik
      initialValues={{
        status: issue.status,
      }}
      validationSchema={IssueStatusFormSchema}
      onSubmit={async (values) => {
        try {
          await update({ id: issue.id, ...values }).unwrap()
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
            id="status"
            disabled={isSubmitting}
            name="status"
            variant="unstyled"
            component={IssueStatusSelectField}
          />
        </Form>
      )}
    </Formik>
  )
}
