/* eslint-disable jsx-a11y/label-has-associated-control */
import { Paper, Button, Stack, createStyles, Title } from '@mantine/core'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { IconCheck, IconX } from '@tabler/icons'
import { showNotification } from '@mantine/notifications'
import { Field, Form, Formik } from 'formik'
import { useAddUserMutation } from '../../services/usersEndpoints'
import TextField from '../common/forms/TextField'
import CreatePasswordField from '../common/forms/CreatePasswordField'
import CheckBoxField from '../common/forms/CheckboxField'

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: '1em',
    display: 'flex',
    height: '80vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    flex: 1,
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      flex: 0.5,
    },
  },
  submitButton: {
    width: '200px',
    alignSelf: 'center',
  },
}))

export default function Register() {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const [addUser] = useAddUserMutation()

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
    terms: Yup.boolean()
      .required('You must accept terms and conditions to register.')
      .oneOf([true], 'You must accept terms and conditions to register'),
  })

  return (
    <main className={classes.wrapper}>
      <Paper shadow="sm" p="lg" withBorder className={classes.paper}>
        <Title order={1} align="center" mt="md" mb=".5em">
          Register
        </Title>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            terms: false,
          }}
          validationSchema={registerSchema}
          onSubmit={async ({ terms: conditions, ...values }) => {
            try {
              // await addUser(values)
              navigate('/login')
              showNotification({
                title: 'Account Created',
                message: 'Please sign in with your new account',
                autoClose: 4000,
                color: 'blue',
                icon: <IconCheck />,
              })
            } catch (e: unknown) {
              showNotification({
                title: 'Error',
                message: 'Could not register new user',
                autoClose: 4000,
                color: 'red',
                icon: <IconX />,
              })
            }
          }}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <Stack>
                <Field
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  required
                  component={TextField}
                />
                <Field
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder="Hancock"
                  required
                  component={TextField}
                />
                <Field
                  id="email"
                  name="email"
                  label="Email address"
                  placeholder="hello@gmail.com"
                  required
                  component={TextField}
                />
                <Field
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="Your password"
                  required
                  component={CreatePasswordField}
                />
                <Field
                  type="checkbox"
                  name="terms"
                  label="I accept terms and conditions"
                  component={CheckBoxField}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className={classes.submitButton}
                >
                  Submit
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Paper>
    </main>
  )
}
