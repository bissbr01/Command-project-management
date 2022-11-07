import {
  ActionIcon,
  Avatar,
  CloseButton,
  createStyles,
  Group,
  useMantineTheme,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import { useAddCommentMutation } from '../../services/commentsEndpoints'
import TextAreaField from '../common/forms/TextAreaField'

const useStyles = createStyles((theme) => ({
  field: {
    flex: 1,
    paddingRight: '2rem',
  },

  buttons: {
    justifyContent: 'flex-end',
    paddingRight: '2rem',
    paddingTop: '0.5em',
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

const CommentSchema = Yup.object().shape({
  text: Yup.string().required('Your comment must not be blank'),
})

export interface SingleFieldFormProps {
  issueId: number
  id: string
  name: string
  placeholder?: string
  size?: string
  inputIcon?: boolean
}

export default function SingleFieldIssueForm({
  issueId,
  id,
  name = id,
  placeholder,
  size = 'sm',
  inputIcon = false,
}: SingleFieldFormProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [focused, setFocused] = useState(false)
  const [addComment] = useAddCommentMutation()

  // formik requires timeouts to wrap setState to not conflict:
  // https://stackoverflow.com/questions/61031464/setstate-called-in-render-prop-is-causing-a-react-warning
  const handleFocus = (bool: boolean) => setTimeout(() => setFocused(bool), 0)

  return (
    <Formik
      validateOnBlur={false}
      initialValues={{
        text: '',
      }}
      validationSchema={CommentSchema}
      onSubmit={async ({ text }) => {
        try {
          await addComment({
            issueId: issueId,
            text,
          }).unwrap()
          showNotification({
            title: 'Success',
            message: 'Comment successfully added.',
            autoClose: 4000,
            color: 'green',
            icon: <IconCheck />,
          })
        } catch (e: unknown) {
          showNotification({
            title: 'Error',
            message: 'Comment could not be added.',
            autoClose: 4000,
            color: 'red',
            icon: <IconX />,
          })
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className={classes.container}>
            <Group>
              {inputIcon && (
                <Avatar color={theme.colors.brand[1]} radius="xl" />
              )}
              <Field
                stylesApi={{ root: classes.field }}
                id={id}
                name={name}
                placeholder={placeholder}
                size={size}
                onFocus={() => handleFocus(true)}
                component={TextAreaField}
              />
            </Group>
            {focused && (
              <Group className={classes.buttons}>
                <ActionIcon
                  type="submit"
                  aria-label="save"
                  disabled={isSubmitting}
                  size="sm"
                  variant="filled"
                  color={theme.colors.brand[1]}
                >
                  <IconCheck />
                </ActionIcon>
                <ActionIcon
                  type="reset"
                  aria-label="close"
                  size="sm"
                  color={theme.colors.brand[7]}
                >
                  <IconX />
                </ActionIcon>
              </Group>
            )}
          </div>
        </Form>
      )}
    </Formik>
  )
}
