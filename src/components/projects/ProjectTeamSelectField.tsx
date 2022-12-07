import {
  createStyles,
  InputVariant,
  Loader,
  Select,
  SelectItem,
} from '@mantine/core'
import { FieldProps } from 'formik'
import { useEffect, useState } from 'react'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import LoadingCircle from '../common/LoadingCircle'

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
  disabled: boolean
}

export default function ProjectTeamSelectField({
  label,
  placeholder,
  variant,
  required = false,
  data = [],
  disabled = false,
  field,
  form,
}: SelectFieldProps) {
  // workaround to get meta.  Might be fixed in future of formik
  const meta = form.getFieldMeta(field.name)
  const { classes } = useStyles()
  const { data: me } = useGetUserByTokenQuery()
  const [teamOptions, setTeamOptions] = useState<
    { value: string; label: string }[]
  >([])

  // set team options from user->teams list
  useEffect(() => {
    if (me && me.teams) {
      setTeamOptions([
        ...me.teams.map(({ name, id }) => ({
          label: name,
          value: id.toString(),
        })),
      ])
    }
  }, [me])

  if (!me) return <LoadingCircle />

  return (
    <Select
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      variant={variant}
      data={teamOptions}
      name={field.name}
      value={field.value}
      clearable
      allowDeselect
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
