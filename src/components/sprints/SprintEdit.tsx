import { createStyles, Button, Text, Group, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import { useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import {
  useGetSprintByIdQuery,
  useLazyGetSprintsQuery,
  useUpdateSprintMutation,
} from '../../services/sprintsEndpoints'
import CheckBoxField from '../common/forms/CheckboxField'
import DatePickerField from '../common/forms/DatePickerField'
import TextAreaField from '../common/forms/TextAreaField'

const useStyles = createStyles((theme) => ({
  container: {
    marginBottom: '1rem',
    '& .mantine-InputWrapper-root': {
      marginBottom: '1rem',
    },
  },

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

  save: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export enum SprintEditModalType {
  START = 'start',
  EDIT = 'edit',
}

export interface SprintEditProps {
  sprintId: string
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SprintEdit({ sprintId, setOpened }: SprintEditProps) {
  const { classes, cx } = useStyles()
  const { data: sprint } = useGetSprintByIdQuery(sprintId)
  const [searchParams] = useSearchParams()
  const [updateSprint] = useUpdateSprintMutation()
  const [fetchSprints] = useLazyGetSprintsQuery()

  const SprintEditModalSchema = Yup.object().shape({
    displayOnBoard: Yup.bool(),
    goal: Yup.string(),
    startOn: Yup.date(),
    endOn: Yup.date(),
  })

  const type = searchParams.get('type')

  if (!sprint) return <Loader />

  return (
    <Formik
      initialValues={{
        displayOnBoard: sprint.displayOnBoard,
        goal: sprint.goal ?? '',
        startOn: sprint.startOn ? new Date(sprint.startOn) : new Date(),
        endOn: sprint.endOn ? new Date(sprint.endOn) : new Date(),
      }}
      validationSchema={SprintEditModalSchema}
      onSubmit={async (values) => {
        try {
          // if setting displayOnBoard, first unset existing
          if (values.displayOnBoard) {
            const foundSprints = await fetchSprints({
              displayOnBoard: true,
            }).unwrap()
            const promises = foundSprints.map(({ id }) =>
              updateSprint({ id, displayOnBoard: false })
            )
            await Promise.all(promises)
          }

          await updateSprint({
            id: sprint.id,
            ...values,
            startOn: values.startOn.toString(),
          })

          setOpened(false)
          showNotification({
            title: 'Success',
            message: 'Sprint successfully saved.',
            autoClose: 4000,
            color: 'green',
            icon: <IconCheck />,
          })
        } catch (e: unknown) {
          showNotification({
            title: 'Error',
            message: 'Sprint could not be updated.',
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
        <Form className={classes.container}>
          <Field
            stylesApi={{ input: cx(classes.inputStyles) }}
            id="displayOnBoard"
            name="displayOnBoard"
            label={<Text>Display on Board</Text>}
            component={CheckBoxField}
          />
          <Field
            stylesApi={{ input: cx(classes.inputStyles) }}
            id="goal"
            name="goal"
            minRows={2}
            label={<Text>Goal</Text>}
            component={TextAreaField}
          />

          <Field
            stylesApi={{ input: cx(classes.inputStyles) }}
            id="startOn"
            name="startOn"
            placeholder="Pick start date..."
            label={<Text>Start On</Text>}
            component={DatePickerField}
          />
          <Field
            stylesApi={{ input: cx(classes.inputStyles) }}
            id="endOn"
            name="endOn"
            placeholder="Pick end date..."
            label={<Text>End On</Text>}
            component={DatePickerField}
          />
          <Group position="center">
            <Button type="submit" disabled={isSubmitting}>
              {type === SprintEditModalType.START ? 'Start' : 'Update'}
            </Button>
            <Button
              onClick={() => setOpened(false)}
              disabled={isSubmitting}
              variant="default"
            >
              Cancel
            </Button>
          </Group>
        </Form>
      )}
    </Formik>
  )
}
