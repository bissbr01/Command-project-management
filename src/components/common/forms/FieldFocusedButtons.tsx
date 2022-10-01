import {
  ActionIcon,
  CloseButton,
  createStyles,
  Group,
  useMantineTheme,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons'

const useStyles = createStyles(() => ({
  buttons: {
    justifyContent: 'flex-end',
    // paddingRight: '1rem',
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
        id="save"
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
        id="reset"
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
