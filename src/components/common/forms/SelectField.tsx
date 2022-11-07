import {
  createStyles,
  InputVariant,
  MantineSize,
  Select,
  SelectItem,
} from '@mantine/core'
import { FieldProps } from 'formik'

const useStyles = createStyles((theme) => ({
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

export interface SelectFieldProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  data: SelectItem[]
  icon?: JSX.Element
  disabled: boolean
  itemComponent: React.FC<any>
  size: MantineSize
}

export default function SelectField({
  label,
  placeholder,
  variant,
  required = false,
  data = [],
  disabled = false,
  size,
  field,
  icon,
  form,
  itemComponent,
}: SelectFieldProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const { classes } = useStyles()
  const meta = form.getFieldMeta(field.name)

  return (
    <Select
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      variant={variant}
      data={data}
      itemComponent={itemComponent}
      icon={icon}
      allowDeselect
      size={size}
      name={field.name}
      value={field.value}
      disabled={disabled}
      classNames={{ item: classes.dropdown }}
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
