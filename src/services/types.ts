import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query'
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks'

export interface BaseModel {
  identifier: string
}

export interface Comment extends BaseModel {
  id: number
  text: string
  authorId: string
  author?: User
  issueId: number
  issue?: Issue
  createdAt: string
  updatedAt: string
}

export enum IssueStatus {
  Todo = 'todo',
  InProgress = 'inProgress',
  Done = 'done',
}

export enum IssueType {
  UserStory = 'userStory',
  Bug = 'bug',
  Task = 'task',
}

export interface Issue extends BaseModel {
  id: number
  name: string
  status: IssueStatus
  attachmentUri?: string
  description?: string
  title?: string
  type: IssueType
  boardOrder?: number
  storyPoints: number
  assignee?: User
  assigneeId: string
  author?: User
  authorId: string
  sprint?: Sprint
  sprintId: number | null
  comments?: Comment[]
}

export interface Sprint extends BaseModel {
  id: number
  name: string
  goal: string
  startOn?: string
  endOn?: string
  length?: number
  active: boolean
  displayOnBoard: boolean
  isBacklog: boolean
  projectId: number
  project: Project
  issues: Issue[]
  author: User
}

export interface Project extends BaseModel {
  id: number
  title: string
  leadId: string
  teamId?: number | null
  sprints?: Sprint[]
  team?: Team
  lead?: User
}

export enum NotificationType {
  ColleagueRequest = 'colleagueRequest',
  ColleagueConfirmed = 'colleagueConfirmed',
  IssueAssigned = 'issueAssigned',
}
export enum NotificationStatus {
  Alert = 'ALERT',
  Read = 'READ',
  Archive = 'ARCHIVE',
}

export interface Notification {
  id: number
  userId: string
  user?: User
  colleagueId: string
  colleague?: User
  type: NotificationType
  message: string
  status: NotificationStatus
  createdAt: string
  updatedAt: string
}

export interface User extends BaseModel {
  id: string
  sub: string
  name: string
  nickname: string
  picture: string
  email: string
  emailVerified: boolean
  createdAt?: string
  updatedAt?: string
  admin: boolean
  disabled: boolean
  projects?: Project[]
  sprints?: Sprint[]
  authoredIssues?: Issue[]
  assignedIssues?: Issue[]
  teams?: Team[]
  friends?: User[]
  notifications?: Notification[]
}

export interface Team extends BaseModel {
  id: number
  name: string
  users?: User[]
}

export interface AccessToken {
  access_token: string
}

export interface Token {
  token: string
}

export interface Credentials {
  email: string
  password: string
}

export function assertUnreachable(x: never): never {
  throw Error('Exhaustive switch reached default condition!')
}

export type IssueForUpdate = Partial<Issue> & Pick<Issue, 'id'>

export interface IssueList {
  name: string
  issues: Issue[]
}

export interface BacklogList extends IssueList {
  sprint: Sprint
}

export type BacklogLists = {
  [key: string]: BacklogList
}

export interface BoardColumn extends IssueList {
  status: IssueStatus
}

export interface BoardColumns {
  [x: string]: BoardColumn
}

export interface BoardColumnsData {
  boardColumns: BoardColumns
  sprint: Sprint
}

export interface ErrorRes {
  errors: { message: string }[]
  name: string
}

declare module '@mantine/core' {
  export interface MantineThemeOther {
    cardWidth: string
    cardHeight: string
  }
}

export type ApiMutationTrigger = MutationTrigger<
  MutationDefinition<
    number,
    BaseQueryFn<
      string | FetchArgs,
      unknown,
      FetchBaseQueryError,
      Record<string, unknown>,
      FetchBaseQueryMeta
    >,
    'Comment' | 'Issue' | 'Sprint' | 'Project' | 'User' | 'Team',
    Record<string, unknown>,
    'scrumApi'
  >
>

export interface UsersById {
  [id: string]: User | null
}
