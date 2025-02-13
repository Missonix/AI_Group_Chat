export interface ChatMessage extends BaseEntity {
  messg_id: int
  type: string
  stream_id: string
  session_id: string
  content: string
  role: string
  session: ChatSession
  type?: string
}

export interface ChatSession extends BaseEntity {
  user_id: string
  session_id: string
  title: string
  message_count: number
  messages: ChatMessage[]
}
export interface Statistic {
  chatCount: number
  tokenCount: number
  wordCount: number
}

export interface ChatConfig extends BaseEntity {
  model: number
  temperature: number
  maxTokens: number
  presencePenalty: number
  apiKey: string
  createdBy: User
  validStatus: 'VALID' | 'INVALID'
}

export interface User extends BaseEntity {
  user_id: string
  username: string
  email: string
  access_token: string
  is_admin: boolean
  is_active: boolean
  ip_address: string
  avatar?: string
}
export class LoginResponse {
  email: string
  ip_address: string
}

export type EditMode = 'CREATE' | 'EDIT'

export interface MyFile {
  name: string
  path: string
  status: 'ready' | 'uploading' | 'finish'
  file?: File
}

export interface QueryRequest<T> {
  pageNum: number
  pageSize: number
  keyword?: string
  query?: Partial<T>
}

export interface Page<T> {
  list: T[]
  total: number
  pageSize: number
  pageNum: number
  totalPages: number
}

export interface BaseEntity {
  // id: string
  updatedAt: string
  createdAt: string
}

// 通用格式 以注册返回为基础
export interface Result<T> {
  code: number
  message: string
  data: T
}

export interface RegistrationData {
  email: string
  ip_address: string
}

export interface LoginData {
  email: string
  refresh_token: string
  ip_address: string
}
