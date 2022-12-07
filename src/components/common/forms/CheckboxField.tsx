import { Checkbox, createStyles, MantineSize } from '@mantine/core'
import { ErrorMessage, FieldProps } from 'formik'

export interface CheckBoxProps extends FieldProps {
  id: string
  label?: string
  size?: MantineSize
}

const useStyles = createStyles((theme) => ({
  error: {
    color: theme.colors.red[4],
    marginTop: -10,
    fontSize: 12,
  },
}))

export default function CheckBoxField({
  field,
  id,
  label = '',
  size = 'md',
}: CheckBoxProps) {
  // workaround to get meta.  Might be fixed in future of formik
  // const meta = form.getFieldMeta(field.name)
  const { classes } = useStyles()
  return (
    <>
      <Checkbox
        {...field}
        id={id}
        label={label}
        size={size}
        checked={field.value}
        mb="sm"
      />
      <ErrorMessage
        name={field.name}
        component="div"
        className={classes.error}
      />
    </>
  )
}
