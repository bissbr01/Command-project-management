import { createStyles, InputVariant, Select, SelectItem } from '@mantine/core'
import { FieldProps } from 'formik'
import { IssueType } from '../../../services/types'
import IssueTypeSelectItem from './IssueTypeSelectItem'
import IssueTypeIcon from '../../issues/IssueTypeIcon'

const typeData = [
  {
    label: 'User Story',
    value: IssueType.UserStory,
    icon: <IssueTypeIcon issueType={IssueType.UserStory} />,
  },
  {
    label: 'Bug',
    value: IssueType.Bug,
    icon: <IssueTypeIcon issueType={IssueType.Bug} />,
  },
  {
    label: 'Task',
    value: IssueType.Task,
    icon: <IssueTypeIcon issueType={IssueType.Task} />,
  },
]

const useStyles = createStyles((theme) => ({
  root: {
    width: 135,
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

export interface IssueTypeSelectFieldProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  data: SelectItem[]
  icon: JSX.Element
  disabled: boolean
  updateOnChange: boolean
}

export default function IssueTypeSelectField({
  label,
  placeholder,
  variant,
  required = false,
  data = typeData,
  disabled = false,
  field,
  form,
}: IssueTypeSelectFieldProps) {
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
      itemComponent={IssueTypeSelectItem}
      data={data}
      icon={<IssueTypeIcon issueType={field.value} />}
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
      // {...field}
    />
  )
}
