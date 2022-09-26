import {
  Button,
  createStyles,
  Group,
  LoadingOverlay,
  Paper,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import {
  useGetIssueByIdQuery,
  useUpdateIssueMutation,
} from '../../services/issuesEndpoints'
import TextAreaField from '../common/forms/TextAreaField'
import IssueTypeIcon from '../common/IssueTypeIcon'
import IssueTypeSelectField from '../common/forms/IssueTypeSelectField'

const useStyles = createStyles((theme) => ({
  container: {
    margin: '1em',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    marginBottom: '.5em',
  },
  description: {
    fontSize: theme.fontSizes.md,
  },
  issueStatus: {
    color: theme.colors.gray[6],
    fontSize: '.8em',
    paddingTop: '.5em',
  },
}))

export interface IssueSingleProps {
  issueId: string
}

export default function IssueSingle({ issueId }: IssueSingleProps) {
  const { classes } = useStyles()
  const { data: issue, isLoading } = useGetIssueByIdQuery(issueId)
  const [update] = useUpdateIssueMutation()

  if (isLoading) return <LoadingOverlay visible={isLoading} />
  if (!issue) return <div>error: no issue</div>

  const LoginSchema = Yup.object().shape({
    type: Yup.string(),
    title: Yup.string(),
    description: Yup.string(),
  })

  return (
    <Paper className={classes.container}>
      <Formik
        initialValues={{
          type: issue.type,
          title: issue.title,
          description: issue.description,
        }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          try {
            const res = await update({ id: issue.id, ...values }).unwrap()
            console.log('update res: ', res)
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
            <Group className={classes.issueStatus}>
              <Field
                // stylesApi={{ input: classes.title }}
                id="type"
                name="type"
                variant="unstyled"
                component={IssueTypeSelectField}
              />
              <Text>Issue {issue.id}</Text>
            </Group>

            <Field
              stylesApi={{ input: classes.title }}
              id="title"
              name="title"
              variant="unstyled"
              component={TextAreaField}
            />
            <Field
              stylesApi={{ input: classes.description }}
              id="description"
              name="description"
              label="description"
              variant="unstyled"
              component={TextAreaField}
            />
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}
