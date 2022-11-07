import { Badge, createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  rightAlign: {
    marginLeft: 'auto',
  },
}))

interface IssueStoryPointsDisplayProps {
  storyPoints: number
}

export default function IssueStoryPointsDisplay({
  storyPoints,
}: IssueStoryPointsDisplayProps) {
  const { classes } = useStyles()

  if (storyPoints <= 0) return <div />
  return (
    <Badge size="xs" color="gray" className={classes.rightAlign}>
      {storyPoints}
    </Badge>
  )
}
