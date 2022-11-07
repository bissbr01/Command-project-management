import { createStyles, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import { FocusEvent } from 'react'
import * as Yup from 'yup'
import { useFocused } from '../../hooks/useFocused'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import { Issue } from '../../services/types'
import FieldFocusedButtons from '../common/forms/FieldFocusedButtons'
import NumberField from '../common/forms/NumberField'
import FormikSubmitOnChange from '../common/forms/FormikSubmitOnChange'

const useStyles = createStyles((theme) => ({
  container: {
    marginBottom: '1rem',
  },

  save: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

interface IssueStoryPointsProps {
  issue: Issue
}

export default function IssueStoryPoints({ issue }: IssueStoryPointsProps) {
  const { classes, cx } = useStyles()
  const [update] = useUpdateIssueMutation()

  const TitleSchema = Yup.object().shape({
    storyPoints: Yup.number(),
  })

  return (
    <Formik
      initialValues={{
        storyPoints: issue.storyPoints ?? 0,
      }}
      validationSchema={TitleSchema}
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
      <Form className={classes.container}>
        <FormikSubmitOnChange />
        <Field
          id="storyPoints"
          name="storyPoints"
          label="Story Points"
          formatter={(value: number) => `${value} points`}
          component={NumberField}
        />
      </Form>
    </Formik>
  )
}
