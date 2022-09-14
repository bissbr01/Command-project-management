import { IconX, IconCheck } from '@tabler/icons'
import { PasswordInput, Progress, Text, Popover, Box } from '@mantine/core'
import { FieldProps } from 'formik'
import { useState } from 'react'

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean
  label: string
}) {
  return (
    <Text
      color={meets ? 'teal' : 'red'}
      sx={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? <IconCheck size={14} /> : <IconX size={14} />}{' '}
      <Box ml={10}>{label}</Box>
    </Text>
  )
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
]

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1
    }
  })

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10)
}

export interface CreatePasswordProps extends FieldProps {
  label: string
  placeholder: string
  description?: string
  required?: boolean
}

export default function CreatePasswordField({
  field,
  label,
  placeholder,
  form,
}: CreatePasswordProps) {
  const [popoverOpened, setPopoverOpened] = useState(false)
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      label={requirement.label}
      meets={requirement.re.test(field.value)}
    />
  ))

  const strength = getStrength(field.value)
  // eslint-disable-next-line no-nested-ternary
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red'

  return (
    <div style={{ maxWidth: 340, margin: 'auto' }}>
      <Popover
        opened={popoverOpened}
        position="bottom"
        width="target"
        transition="pop"
      >
        <Popover.Target>
          <div
            onFocusCapture={() => setPopoverOpened(true)}
            onBlurCapture={() => setPopoverOpened(false)}
          >
            <PasswordInput
              withAsterisk
              label={label}
              placeholder={placeholder}
              error={meta.touched && meta.error}
              {...field}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Progress
            color={color}
            value={strength}
            size={5}
            style={{ marginBottom: 10 }}
          />
          <PasswordRequirement
            label="Includes at least 6 characters"
            meets={field.value.length > 5}
          />
          {checks}
        </Popover.Dropdown>
      </Popover>
    </div>
  )
}
