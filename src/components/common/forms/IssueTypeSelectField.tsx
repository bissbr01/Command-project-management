import { InputVariant, Select, SelectItem } from '@mantine/core'
import { IconBookmark, IconBug, IconCheckbox } from '@tabler/icons'
import { FieldProps } from 'formik'
import { IssueType } from '../../../services/types'
import IssueTypeSelectItem from './IssueTypeSelectItem'
import IssueTypeIcon from '../IssueTypeIcon'

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

export interface IssueTypeSelectFieldProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  data: SelectItem[]
  icon: JSX.Element
}

export default function IssueTypeSelectField({
  label,
  placeholder,
  variant,
  required = false,
  data = typeData,
  field,
  form,
}: IssueTypeSelectFieldProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
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
