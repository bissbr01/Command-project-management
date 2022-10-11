import { InputVariant, MantineSize, TextInputStylesNames } from '@mantine/core'
import { FieldProps, useFormikContext } from 'formik'
import { DatePicker } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons'

export interface DatePickerProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  stylesApi?: Partial<Record<TextInputStylesNames, string>> | undefined
  size: MantineSize
}

export default function DatePickerField({
  label,
  placeholder,
  variant,
  required = false,
  stylesApi,
  size = 'sm',
  field,
  form,
}: DatePickerProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  const { setFieldValue } = useFormikContext()

  return (
    <DatePicker
      {...field}
      onChange={(date) => {
        // workaround, see https://stackoverflow.com/questions/56312372/react-datepicker-with-a-formik-form/56320889#56320889
        setFieldValue(field.name, date)
      }}
      size={size}
      label={label}
      placeholder={placeholder}
      icon={<IconCalendar size={16} />}
      withAsterisk={required}
      error={meta.touched && meta.error}
      variant={variant}
      classNames={stylesApi}
    />
  )
}
