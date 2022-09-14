import { PasswordInput } from '@mantine/core'
import { FieldProps } from 'formik'

export interface PasswordProps extends FieldProps {
  label: string
  placeholder: string
}

export default function PasswordField({
  field,
  label,
  placeholder,
  form,
}: PasswordProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  return (
    <PasswordInput
      label={label}
      placeholder={placeholder}
      withAsterisk
      error={meta.touched && meta.error}
      {...field}
    />
  )
}
