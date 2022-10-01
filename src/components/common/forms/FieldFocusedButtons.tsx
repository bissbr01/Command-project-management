import {
  ActionIcon,
  CloseButton,
  createStyles,
  Group,
  useMantineTheme,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons'
import { FormikState } from 'formik'

const useStyles = createStyles(() => ({
  buttons: {
    justifyContent: 'flex-end',
    paddingRight: '2rem',
    paddingTop: '0.5em',
  },
}))

interface FieldFocusedButtonsProps {
  handleFocused: (bool: boolean) => NodeJS.Timeout
  isSubmitting: boolean
}

export default function FieldFocusedButtons({
  handleFocused,
  isSubmitting,
}: FieldFocusedButtonsProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()

  return (
    <Group className={classes.buttons}>
      <ActionIcon
        type="submit"
        aria-label="save"
        disabled={isSubmitting}
        size="sm"
        variant="filled"
        color={theme.colors.brand[1]}
      >
        <IconCheck />
      </ActionIcon>
      <CloseButton
        type="reset"
        aria-label="close"
        size="sm"
        variant="default"
        onClick={() => {
          handleFocused(false)
        }}
      />
    </Group>
  )
}
