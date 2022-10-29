import { createStyles, Group, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import { Issue } from '../../services/types'
import FormikSubmitOnChange from '../common/forms/FormikSubmitOnChange'
import IssueTypeSelectField from '../common/forms/IssueTypeSelectField'

const useStyles = createStyles((theme) => ({
  form: {
    '&:hover, &:active': {
      background: theme.colors.gray[1],
      borderRadius: theme.radius.md,
    },
  },
}))

interface IssueTypeFormProps {
  issue: Issue
}

export default function IssueTypeForm({ issue }: IssueTypeFormProps) {
  const { classes } = useStyles()
  const [update] = useUpdateIssueMutation()

  const IssueTypeFormSchema = Yup.object().shape({
    type: Yup.string(),
  })

  return (
    <Formik
      initialValues={{
        type: issue.type,
      }}
      validationSchema={IssueTypeFormSchema}
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
            id="type"
            disabled={isSubmitting}
            name="type"
            value="type"
            variant="unstyled"
            component={IssueTypeSelectField}
          />
        </Form>
      )}
    </Formik>
  )
}
