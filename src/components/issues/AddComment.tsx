import {
  ActionIcon,
  Avatar,
  Button,
  CloseButton,
  createStyles,
  Group,
  Stack,
  useMantineTheme,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import { useFocused } from '../../hooks/useFocused'
import { useAddCommentMutation } from '../../services/commentsEndpoints'
import FieldFocusedButtons from '../common/forms/FieldFocusedButtons'
import TextAreaField from '../common/forms/TextAreaField'

const useStyles = createStyles((theme) => ({
  field: {
    flex: 1,
    paddingRight: '2rem',
    // flexGrow: 1,
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

interface AddCommentProps {
  issueId: number
}

export default function AddComment({ issueId }: AddCommentProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const { focused, handleFocused } = useFocused()
  const [addComment] = useAddCommentMutation()

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
          console.log('update res: ', res)
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
          if (e instanceof Error) {
            console.log(e.message)
          }
        }
      }}
    >
      {({ isSubmitting, handleBlur }) => (
        <Form>
          <div className={classes.container}>
            <Group>
              <Avatar color={theme.colors.brand[1]} radius="xl" />
              <Field
                stylesApi={{ root: classes.field }}
                id="text"
                name="text"
                placeholder="Add a comment..."
                size="xs"
                onFocus={() => handleFocused(true)}
                onBlur={(e: Event) => {
                  handleBlur(e)
                  handleFocused(false)
                }}
                component={TextAreaField}
              />
            </Group>
            {focused && (
              <FieldFocusedButtons
                isSubmitting={isSubmitting}
                handleFocused={handleFocused}
              />
            )}
          </div>
        </Form>
      )}
    </Formik>
  )
}
