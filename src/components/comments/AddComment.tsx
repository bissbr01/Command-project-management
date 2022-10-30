import { useAuth0 } from '@auth0/auth0-react'
import {
  ActionIcon,
  Avatar,
  Button,
  CloseButton,
  createStyles,
  Group,
  Loader,
  Stack,
  useMantineTheme,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import { FocusEvent, SyntheticEvent, useState } from 'react'
import * as Yup from 'yup'
import { useFocused } from '../../hooks/useFocused'
import { useAddCommentMutation } from '../../services/commentsEndpoints'
import FieldFocusedButtons from '../common/forms/FieldFocusedButtons'
import TextAreaField from '../common/forms/TextAreaField'
import LoadingCircle from '../common/LoadingCircle'

const useStyles = createStyles((theme) => ({
  field: {
    flex: 1,
    paddingRight: '2rem',
    // flexGrow: 1,
  },

  buttons: {
    // justifyContent: 'flex-end',
    paddingRight: '2rem',
    // paddingTop: '0.5em',
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

const CommentSchema = Yup.object().shape({
  text: Yup.string().required('Your comment must not be blank'),
})

interface AddCommentProps {
  issueId: number
}

export default function AddComment({ issueId }: AddCommentProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const { focused, handleFocused } = useFocused()
  const [addComment] = useAddCommentMutation()
  const { user } = useAuth0()

  if (!user) return <LoadingCircle />

  return (
    <Formik
      validateOnBlur={false}
      // validateOnChange={false}
      initialValues={{
        text: '',
      }}
      validationSchema={CommentSchema}
      onSubmit={async ({ text }, { resetForm }) => {
        try {
          const res = await addComment({
            issueId,
            text,
          }).unwrap()
          showNotification({
            title: 'Success',
            message: 'Comment successfully added.',
            autoClose: 4000,
            color: 'green',
            icon: <IconCheck />,
          })
          resetForm()
          handleFocused(false)
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
      {({ isSubmitting, handleBlur }) => (
        <Form>
          <div className={classes.container}>
            <Group>
              <Avatar
                src={user.picture}
                color={theme.colors.brand[1]}
                radius="xl"
              />
              <Field
                stylesApi={{ root: classes.field }}
                id="text"
                name="text"
                placeholder="Add a comment..."
                size="xs"
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
                component={TextAreaField}
              />
            </Group>
            {focused && (
              <div className={classes.buttons}>
                <FieldFocusedButtons
                  isSubmitting={isSubmitting}
                  handleFocused={handleFocused}
                />
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  )
}
