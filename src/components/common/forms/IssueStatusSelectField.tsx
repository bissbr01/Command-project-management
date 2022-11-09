import { createStyles, InputVariant, Select, SelectItem } from '@mantine/core'
import { FieldProps } from 'formik'
import { IssueStatus } from '../../../services/types'
import IssueStatusSelectItem from './IssueStatusSelectItem'
import IssueStatusDisplay from '../../issues/IssueStatusDisplay'

const statuses = [
  {
    label: 'Todo',
    value: IssueStatus.Todo,
  },
  {
    label: 'In Progress',
    value: IssueStatus.InProgress,
  },
  {
    label: 'Done',
    value: IssueStatus.Done,
  },
]

const useStyles = createStyles((theme) => ({
  root: {
    width: 140,
  },

  dropdown: {
    '&[data-selected]': {
      backgroundColor: theme.colors.gray[2],
      color: theme.black,
      '&:hover': {
        backgroundColor: theme.colors.gray[2],
      },
    },
  },
}))

export interface IssueStatusSelectFieldProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  data: SelectItem[]
  icon: JSX.Element
  disabled: boolean
  updateOnChange: boolean
}

export default function IssueStatusSelectField({
  label,
  placeholder,
  variant,
  required = false,
  data = statuses,
  disabled = false,
  field,
  form,
}: IssueStatusSelectFieldProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  const { classes } = useStyles()

  return (
    <Select
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      variant={variant}
      itemComponent={IssueStatusSelectItem}
      data={data}
      icon={<IssueStatusDisplay status={field.value} />}
      iconWidth={120}
      name={field.name}
      value={field.value}
      disabled={disabled}
      classNames={{ item: classes.dropdown, root: classes.root }}
      styles={{ input: { fontSize: 0 } }}
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
