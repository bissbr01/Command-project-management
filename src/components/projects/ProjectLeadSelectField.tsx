import {
  createStyles,
  InputVariant,
  Loader,
  Select,
  SelectItem,
} from '@mantine/core'
import { FieldProps, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'

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

export interface ProjectCreateFields {
  title: string
  teamId: string
  leadId: string
}

export interface SelectFieldProps extends FieldProps {
  label?: string
  placeholder?: string
  variant?: InputVariant
  required?: boolean
  data: SelectItem[]
  icon: JSX.Element
  disabled: boolean
  updateOnChange: boolean
}

export default function ProjectLeadSelectField({
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
  const {
    values: { teamId },
    touched,
    setFieldValue,
  } = useFormikContext<ProjectCreateFields>()
  const [leadOptions, setLeadOptions] = useState<
    { value: string; label: string }[]
  >([])

  // when team is selected, propigate lead options with teammates
  useEffect(() => {
    if (me) {
      if (me && me.teams && teamId) {
        const selectedTeam = me.teams.filter(({ id }) => id === Number(teamId))
        if (
          selectedTeam &&
          Array.isArray(selectedTeam) &&
          selectedTeam.length !== 0 &&
          selectedTeam[0].users
        ) {
          setLeadOptions(
            selectedTeam[0].users.map(({ name, id }) => ({
              label: name,
              value: id.toString(),
            }))
          )
        } else {
          setLeadOptions([{ label: me.name, value: me.id.toString() }])
        }
      } else {
        setLeadOptions([{ label: me.name, value: me.id.toString() }])
      }
    }
  }, [me, me?.teams, setFieldValue, teamId, touched.teamId])

  if (!me) return <Loader />

  return (
    <Select
      label={label}
      placeholder={placeholder}
      withAsterisk={required}
      error={meta.touched && meta.error}
      variant={variant}
      data={leadOptions}
      allowDeselect
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
