import {
  createStyles,
  InputVariant,
  MultiSelect,
  SelectItem,
} from '@mantine/core'
import { FieldProps } from 'formik'

const useStyles = createStyles((theme) => ({
  root: {
    // width: 140,
  },

  dropdown: {
    '&[data-selected]': {
      backgroundColor: theme.colors.brand[1],
      color: theme.black,
      '&:hover': {
        backgroundColor: theme.colors.brand[2],
      },
    },
  },
}))

export interface MultiSelectFieldProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  data: SelectItem[]
  // icon?: JSX.Element
  disabled: boolean
}

export default function MultiSelectField({
  label,
  placeholder,
  variant,
  required = false,
  data = [],
  disabled = false,
  field,
  form,
}: MultiSelectFieldProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const { classes } = useStyles()
  const meta = form.getFieldMeta(field.name)

  return (
    <MultiSelect
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      variant={variant}
      data={data}
      name={field.name}
      value={field.value}
      disabled={disabled}
      classNames={{ item: classes.dropdown, root: classes.root }}
      onChange={(value) => {
        const event = {
          target: {
            value: value,
            name: field.name,
          },
        }
        field.onChange(event)
      }}
    />
  )
}
