import {
  Button,
  Container,
  createStyles,
  Group,
  Loader,
  Text,
  Title,
} from '@mantine/core'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useGetIssuesByTokenQuery } from '../../services/issuesEndpoints'
import { useGetSprintByActiveQuery } from '../../services/sprintsEndpoints'
import { IssueStatus } from '../../services/types'
import NavBreadcrumbs from '../common/Breadcrumbs'
import IssueDrawer from '../issues/IssueDrawer'
import Board from './Board'

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  title: {
    margin: '.5em 0',
    color: theme.colors.gray[8],
    justifySelf: 'flex-start',
    alignSelf: 'flex-start',

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      textAlign: 'left',
    },
  },
  sprintItems: {
    margin: '.5em 0',
    display: 'flex',
    flex: '0 1 content',
    flexDirection: 'column',
    alignItems: 'center',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'row',
    },
  },
  rightGroup: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  sprintButton: {},
}))

export default function BoardLayout() {
  const { classes } = useStyles()
  const { data: { sprint } = {}, isLoading } = useGetSprintByActiveQuery()

  if (isLoading) return <Loader />

  return (
    <main>
      <div className={classes.sprintItems}>
        <Title className={classes.title} order={1} size="h2">
          Sprint {sprint?.id}
        </Title>
        <div className={classes.rightGroup}>
          {sprint?.end && (
            <Text color="dimmed" mr={20}>
              End: {DateTime.fromMillis(Number(sprint.end)).toFormat('LLL dd')}
            </Text>
          )}
          <Button
            variant="default"
            size="sm"
            classNames={{ root: classes.sprintButton }}
          >
            Complete Sprint
          </Button>
        </div>
      </div>
      <Board />
    </main>
  )
}
