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
  container: {
    margin: '1em',
    height: '100%',
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

  title: {
    fontSize: theme.fontSizes.xl,
    marginBottom: '.5em',
  },

  description: {
    fontSize: theme.fontSizes.md,
  },

  save: {
    alignItems: 'center',
    justifyContent: 'center',
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
          await update({ id: issue.id, ...values })
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
          if (e instanceof Error) {
            console.log(e.message)
          }
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
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
