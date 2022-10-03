import * as Yup from 'yup'
import { Field, Form, Formik } from 'formik'
import { showNotification } from '@mantine/notifications'
import { createStyles, Group } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons'
import { FocusEvent } from 'react'
import { IssueStatus, IssueType } from '../../services/types'
import { useAddIssueMutation } from '../../services/issuesEndpoints'
import TextField from '../common/forms/TextField'
import { useFocused } from '../../hooks/useFocused'
import FieldFocusedButtons from '../common/forms/FieldFocusedButtons'
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
    marginTop: '1rem',
  },

  description: {
    fontSize: theme.fontSizes.md,
  },

  issueStatus: {
    color: theme.colors.gray[6],
    fontSize: '.8em',
    paddingTop: '.5em',
    marginTop: -50,
  },

  save: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

interface BacklogCreateIssueProps {
  sprintId: number
  status: IssueStatus
}

export default function BacklogCreateIssue({
  sprintId,
  status,
}: BacklogCreateIssueProps) {
  const { classes, cx } = useStyles()
  const { focused, handleFocused } = useFocused()
  const [createIssue] = useAddIssueMutation()

  const CreateIssueSchema = Yup.object().shape({
    status: Yup.string().required(),
    type: Yup.string().required(),
    title: Yup.string().required('You must provide a title'),
  })

  return (
    <Formik
      initialValues={{
        status,
        type: IssueType.Task,
        title: '',
      }}
      validationSchema={CreateIssueSchema}
      onSubmit={async (values) => {
        try {
          await createIssue({ ...values, sprintId })
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
      {({ isSubmitting, handleBlur }) => (
        <Form>
          <Group
            onFocus={() => handleFocused(true)}
            onBlur={(e: FocusEvent) => {
              handleBlur(e)
              // if not clicking a form button, unfocus
              if (
                !(e.relatedTarget?.id === 'save') &&
                !(e.relatedTarget?.id === 'reset')
              ) {
                handleFocused(false)
              }
            }}
          >
            <Field
              id="type"
              name="type"
              value="type"
              variant="unstyled"
              onFocus={() => handleFocused(true)}
              component={IssueTypeSelectField}
            />
            <Field
              stylesApi={{ input: cx(classes.title, classes.inputStyles) }}
              id="title"
              name="title"
              variant="unstyled"
              minRows="3"
              component={TextField}
            />
            {focused && (
              <FieldFocusedButtons
                isSubmitting={isSubmitting}
                handleFocused={handleFocused}
              />
            )}
          </Group>
        </Form>
      )}
    </Formik>
  )
}
