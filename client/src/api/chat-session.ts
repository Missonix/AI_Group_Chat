import type { ChatSession, Page, QueryRequest } from '../../typings'
import requestWithToken from '../utils/request'

export const queryChatSession = (userId: string, query: QueryRequest<ChatSession>) => {
  return requestWithToken<Page<ChatSession>>(
    `/aichat/getsessionlistshow/${encodeURIComponent(userId)}`,
    'GET',
    { params: query }, // 确保参数作为URL参数传递
  )
}

export const saveChatSession = (data: { user_id: string; title?: string }) => {
  return requestWithToken<ChatSession>('/aichat/createsession', 'POST', {
    user_id: data.user_id,
    title: data.title || '新的聊天',
  })
}

export const updateSessionTitle = (data: { sessionId: string; new_title: string }) => {
  return requestWithToken<ChatSession>(`/aichat/sessions/${data.sessionId}`, 'PATCH', {
    new_title: data.new_title,
  })
}

export const findChatSessionById = (sessionId: string) => {
  return requestWithToken<ChatSession>(`/aichat/sessions/${sessionId}`, 'GET', {})
}

export const invalidChatSession = (id: string) => {
  return requestWithToken<boolean>(`/chatSession/${id}/invalid`, 'POST', {})
}
export const validChatSession = (id: string) => {
  return requestWithToken<boolean>(`/chatSession/${id}/valid`, 'POST', {})
}
export const deleteChatSession = (sessionId: string) => {
  return requestWithToken<boolean>(`/aichat/deletesession/${sessionId}`, 'DELETE', {})
}
