import {
  InputVariant,
  MantineSize,
  TextInput,
  TextInputStylesNames,
} from '@mantine/core'
import { FieldProps } from 'formik'
import { DatePicker } from '@mantine/dates'

export interface TextProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  stylesApi?: Partial<Record<TextInputStylesNames, string>> | undefined
  size: MantineSize
}

export default function TextField({
  label,
  placeholder,
  variant,
  required = false,
  stylesApi,
  size = 'md',
  field,
  form,
}: TextProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  return (
    <DatePicker
      {...field}
      value={[new Date()]}
      onChange={({ date }) => setValue(Array.isArray(date) ? date : [date])}
      quickSelect
      range
      clearable
      positive
      size={size}
      maxDate={undefined}
      minDate={undefined}
      timeSelectStart
      timeSelectEnd
      disabled
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      variant={variant}
      classNames={stylesApi}
    />
  )
}
