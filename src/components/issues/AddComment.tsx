import { createStyles } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useAddCommentMutation } from '../../services/commentsEndpoints'
import { Issue } from '../../services/types'
import TextAreaField from '../common/forms/TextAreaField'

const useStyles = createStyles((theme) => ({
  container: {
    // background: 'white',
  },
}))

const CommentSchema = Yup.object().shape({
  text: Yup.string().required('Your comment must have some text'),
})

interface AddCommentProps {
  issue: Issue
}

export default function AddComment({ issue }: AddCommentProps) {
  const { classes } = useStyles()
  const [addComment] = useAddCommentMutation()
  return (
    <Formik
      initialValues={{
        text: '',
      }}
      validationSchema={CommentSchema}
      onSubmit={async (values) => {
        try {
          const res = await addComment({
            issueId: issue.id,
            ...values,
          }).unwrap()
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
          <Field
            // stylesApi={{ input: classes.text }}
            id="text"
            name="text"
            // variant=
            component={TextAreaField}
          />
        </Form>
      )}
    </Formik>
  )
}
