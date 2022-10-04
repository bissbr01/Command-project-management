import * as Yup from 'yup'
import { Field, Form, Formik } from 'formik'
import { showNotification } from '@mantine/notifications'
import { createStyles, Group, Text, UnstyledButton } from '@mantine/core'
import { IconCheck, IconPlus, IconX } from '@tabler/icons'
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

  title: {
    flex: '1 0 content',
  },

  formGroup: {
    margin: '0 -12px -12px -12px',
  },

  createButton: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 0 content',
    justifyContent: 'flex-start',
    padding: '0.5rem 1rem 1rem 1rem',
    backgroundColor: theme.colors.gray[1],
  },

  createIcon: {
    fontSize: '10px',
    padding: '0 10px 0 0',
  },

  inputSection: {
    backgroundColor: theme.white,
    flex: '1 0 content',
    padding: '0 12px 6px 12px',
    border: `2px solid ${theme.colors.blue[4]}`,
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
      onSubmit={async (values, { resetForm }) => {
        try {
          console.log('values: ', values)
          console.log('sprintId: ', sprintId)
          const res = await createIssue({ ...values, sprintId }).unwrap()
          console.log('response: ', res)
          handleFocused(false)
          resetForm()
          showNotification({
            title: 'Success',
            message: 'Issue successfully saved.',
            autoClose: 4000,
            color: 'green',
            icon: <IconCheck stroke={0.5} />,
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
            {!focused && (
              <UnstyledButton
                className={classes.createButton}
                onClick={() => handleFocused(true)}
              >
                <IconPlus className={classes.createIcon} />
                <Text>Create Issue</Text>
              </UnstyledButton>
            )}
            {focused && (
              <Group className={classes.inputSection}>
                <Field
                  id="type"
                  name="type"
                  value="type"
                  variant="unstyled"
                  onFocus={() => handleFocused(true)}
                  component={IssueTypeSelectField}
                />
                <Field
                  stylesApi={{ root: classes.title }}
                  id="title"
                  name="title"
                  placeholder="New Issue Title"
                  variant="unstyled"
                  minRows="3"
                  component={TextField}
                />
                <FieldFocusedButtons
                  isSubmitting={isSubmitting}
                  handleFocused={handleFocused}
                  size="xs"
                />
              </Group>
            )}
          </Group>
        </Form>
      )}
    </Formik>
  )
}
