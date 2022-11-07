import * as Yup from 'yup'
import { Field, Form, Formik } from 'formik'
import { showNotification } from '@mantine/notifications'
import {
  createStyles,
  Group,
  MantineSize,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { IconCheck, IconPlus, IconX } from '@tabler/icons'
import { useParams } from 'react-router-dom'
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

  createButton: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 1 content',
    justifyContent: 'flex-start',
    padding: '0.5rem 1rem 1rem 1rem',
    backgroundColor: theme.colors.gray[1],
    color: theme.colors.gray[7],
  },

  createIcon: {
    fontSize: theme.fontSizes.md,
    padding: '0 10px 0 0',
  },

  inputSection: {
    backgroundColor: theme.white,
    flex: '1 1 content',
    flexWrap: 'nowrap',
    border: `2px solid ${theme.colors.blue[4]}`,
    '& > .mantine-TextInput-root': {
      flex: '1 1 content',
      paddingLeft: '.5rem',
    },
  },

  save: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
}))

export interface BacklogCreateIssueProps {
  sprintId: number | null
  status: IssueStatus
  size?: MantineSize
}

export default function BacklogCreateIssue({
  sprintId,
  status,
  size = 'md',
}: BacklogCreateIssueProps) {
  const { classes, cx } = useStyles()
  const { focused, handleFocused } = useFocused()
  const { projectId } = useParams()
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
          await createIssue({
            ...values,
            sprintId,
            projectId: Number(projectId),
          }).unwrap()
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
        }
      }}
    >
      {({ isSubmitting, handleBlur }) => (
        <Form>
          <Group
            align="center"
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
                <Text size={size}>Create Issue</Text>
              </UnstyledButton>
            )}
            {focused && (
              <Group className={classes.inputSection}>
                {size !== 'sm' && size !== 'xs' && (
                  <Field
                    id="type"
                    name="type"
                    value="type"
                    size={size}
                    variant="unstyled"
                    onFocus={() => handleFocused(true)}
                    component={IssueTypeSelectField}
                  />
                )}
                <Field
                  stylesApi={{ root: classes.title }}
                  id="title"
                  name="title"
                  placeholder="Enter Title..."
                  variant="unstyled"
                  size={size}
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
