export interface Comment {
  id: number
  text: string
  authorId: number
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

export interface Issue {
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
  author?: User
  sprint?: Sprint
  sprintId: number | null
  comments?: Comment[]
}

export interface Sprint {
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

export interface Project {
  id: number
  title: string
  leadId: string
  teamId?: number
  sprints?: Sprint[]
  team?: Team
  lead?: User
}

export interface User {
  id: number
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
}

export interface Team {
  id: number
  name: string
  users?: User[]
}

export interface Auth0TokenContainer {
  access_token: string
  id_token?: string
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
