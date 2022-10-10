import {
  InputVariant,
  MantineSize,
  Textarea,
  TextInputStylesNames,
} from '@mantine/core'
import { FieldProps } from 'formik'
import { FocusEventHandler } from 'react'

export interface TextAreaProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  stylesApi?: Partial<Record<TextInputStylesNames, string>> | undefined
  required?: boolean
  minRows?: number
  maxRows?: number
  onFocus?: FocusEventHandler<HTMLTextAreaElement>
  onBlur?: FocusEventHandler<HTMLTextAreaElement>
  size?: MantineSize
}

export default function TextAreaField({
  field,
  label,
  placeholder,
  variant,
  stylesApi,
  minRows = 1,
  maxRows = 4,
  size = 'md',
  onFocus,
  onBlur,
  form,
  required = false,
}: TextAreaProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  return (
    <Textarea
      {...field}
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      classNames={stylesApi}
      autosize
      minRows={minRows}
      maxRows={maxRows}
      size={size}
      onFocus={onFocus}
      onBlur={onBlur}
      error={meta.touched && meta.error}
      variant={variant}
    />
  )
}
