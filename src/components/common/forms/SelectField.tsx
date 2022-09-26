import { InputVariant, Select, SelectItem } from '@mantine/core'
import { FieldProps } from 'formik'

export interface SelectFieldProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  data: (string | SelectItem)[]
}

export default function SelectField({
  label,
  placeholder,
  variant,
  required = false,
  data,
  field,
  form,
}: SelectFieldProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  return (
    <Select
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      variant={variant}
      data={data}
      {...field}
    />
  )
}
