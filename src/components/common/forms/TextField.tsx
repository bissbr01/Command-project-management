import { TextInput } from '@mantine/core'
import { FieldProps } from 'formik'

export interface TextProps extends FieldProps {
  label: string
  placeholder: string
  required?: boolean
}

export default function TextField({
  field,
  label,
  placeholder,
  meta,
  required = false,
}: TextProps) {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      {...field}
    />
  )
}
