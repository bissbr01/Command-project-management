import { InputVariant, Textarea, TextInputStylesNames } from '@mantine/core'
import { FieldProps } from 'formik'

export interface TextAreaProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  stylesApi?: Partial<Record<TextInputStylesNames, string>> | undefined
  required?: boolean
}

export default function TextAreaField({
  field,
  label,
  placeholder,
  variant,
  stylesApi,
  form,
  required = false,
}: TextAreaProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  return (
    <Textarea
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      classNames={stylesApi}
      autosize
      error={meta.touched && meta.error}
      variant={variant}
      {...field}
    />
  )
}
