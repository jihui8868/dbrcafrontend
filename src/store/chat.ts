import { create } from 'zustand'
import { Conversation, Message } from '../types'
import { apiClient } from '../services/api'

interface ChatStore {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  isLoading: boolean
  isSending: boolean
  error: string | null

  setConversations: (conversations: Conversation[]) => void
  setCurrentConversation: (conversation: Conversation | null) => void
  setMessages: (messages: Message[]) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  setSending: (sending: boolean) => void

  fetchConversations: () => Promise<void>
  createConversation: () => Promise<void>
  selectConversation: (id: string) => Promise<void>
  addMessage: (message: Message) => void
  updateMessage: (id: string, content: string) => void
  sendMessage: (content: string) => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSending: (sending) => set({ isSending: sending }),

  fetchConversations: async () => {
    set({ isLoading: true, error: null })
    try {
      const conversations = await apiClient.listConversations()
      set({ conversations, isLoading: false })
    } catch (error: any) {
      set({ error: 'Failed to fetch conversations', isLoading: false })
    }
  },

  createConversation: async () => {
    set({ isLoading: true, error: null })
    try {
      const conversation = await apiClient.createConversation()
      const { conversations } = get()
      set({
        conversations: [conversation, ...conversations],
        currentConversation: conversation,
        messages: [],
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: 'Failed to create conversation', isLoading: false })
    }
  },

  selectConversation: async (id: string) => {
    const { conversations } = get()
    const conversation = conversations.find((c) => c.id === id)
    if (conversation) {
      set({ currentConversation: conversation, isLoading: true, error: null })
      try {
        const messages = await apiClient.getMessages(id)
        set({ messages, isLoading: false })
      } catch (error: any) {
        set({ error: 'Failed to load messages', isLoading: false })
        set({ messages: [] })
      }
    }
  },

  addMessage: (message: Message) => {
    const { messages } = get()
    set({ messages: [...messages, message] })
  },

  updateMessage: (id: string, content: string) => {
    const { messages } = get()
    const updated = messages.map((msg) =>
      msg.id === id ? { ...msg, content } : msg
    )
    set({ messages: updated })
  },

  sendMessage: async (content: string) => {
    const { currentConversation, addMessage, updateMessage, setSending } = get()
    if (!currentConversation) return

    setSending(true)
    set({ error: null })

    try {
      const userMessageId = Date.now().toString()
      addMessage({
        id: userMessageId,
        role: 'user',
        content,
      })

      let fullResponse = ''
      const assistantMessageId = Date.now().toString() + '_a'
      let hasAssistantMessage = false
      let lineBuffer = ''

      try {
        const reader = await apiClient.sendMessage(currentConversation.id, content)
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          lineBuffer += chunk
          const lines = lineBuffer.split('\n')

          // Keep the last incomplete line in the buffer
          lineBuffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim()) continue

            try {
              // Parse JSON event
              const event = JSON.parse(line)
              const eventType = event.event
              const eventData = event.data || {}

              console.log('Received event:', eventType, eventData)

              if (eventType === 'llm_start') {
                // LLM 开始处理
                if (!hasAssistantMessage) {
                  fullResponse = '💭 思考中...'
                  addMessage({
                    id: assistantMessageId,
                    role: 'assistant',
                    content: fullResponse,
                  })
                  hasAssistantMessage = true
                }
              } else if (eventType === 'llm_stream' && eventData.content) {
                // LLM 流式内容 - 替换思考指示，追加实际内容
                if (fullResponse === '💭 思考中...') {
                  fullResponse = eventData.content
                } else {
                  fullResponse += eventData.content
                }
                if (!hasAssistantMessage) {
                  addMessage({
                    id: assistantMessageId,
                    role: 'assistant',
                    content: fullResponse,
                  })
                  hasAssistantMessage = true
                } else {
                  updateMessage(assistantMessageId, fullResponse)
                }
              } else if (eventType === 'tool_start') {
                // 工具开始执行
                fullResponse += `\n📍 工具执行: ${eventData.tool}\n`
                if (!hasAssistantMessage) {
                  addMessage({
                    id: assistantMessageId,
                    role: 'assistant',
                    content: fullResponse,
                  })
                  hasAssistantMessage = true
                } else {
                  updateMessage(assistantMessageId, fullResponse)
                }
              } else if (eventType === 'tool_end') {
                // 工具执行完成
                fullResponse += `✅ ${eventData.tool} 执行完成\n`
                updateMessage(assistantMessageId, fullResponse)
              } else if (eventType === 'agent_end') {
                // 代理处理完成 - 添加最终输出
                if (eventData.output && !eventData.output.startsWith('[')) {
                  // 只添加纯文本输出，跳过内部数据结构
                  if (fullResponse.includes('💭') || fullResponse.includes('📍')) {
                    // 如果之前有工具执行记录，直接追加
                    fullResponse += eventData.output
                  } else {
                    // 否则使用输出替换之前的内容
                    fullResponse = eventData.output
                  }
                  updateMessage(assistantMessageId, fullResponse)
                }
              } else if (eventType === 'error') {
                // 错误
                set({ error: eventData.message || 'Unknown error' })
              } else if (eventType === 'done') {
                // 流式处理完成
                console.log('Stream processing completed')
              } else if (eventType === 'user_message') {
                // 用户消息（可选处理）
                console.log('User message event received')
              }
            } catch (e) {
              // Ignore JSON parse errors for non-JSON lines
              if (line.trim()) {
                console.debug('Non-JSON line received:', line)
              }
            }
          }
        }

        // Process any remaining data in the buffer
        if (lineBuffer && lineBuffer.trim()) {
          try {
            const event = JSON.parse(lineBuffer)
            const eventType = event.event
            const eventData = event.data || {}

            console.log('Processing buffer event:', eventType, eventData)

            if (eventType === 'llm_stream' && eventData.content) {
              fullResponse += eventData.content
              if (!hasAssistantMessage) {
                addMessage({
                  id: assistantMessageId,
                  role: 'assistant',
                  content: fullResponse,
                })
              } else {
                updateMessage(assistantMessageId, fullResponse)
              }
            } else if (eventType === 'agent_end' && eventData.output) {
              if (eventData.output && !eventData.output.startsWith('[')) {
                if (fullResponse.includes('💭') || fullResponse.includes('📍')) {
                  fullResponse += eventData.output
                } else {
                  fullResponse = eventData.output
                }
                updateMessage(assistantMessageId, fullResponse)
              }
            }
          } catch (e) {
            // Ignore
          }
        }
      } catch (error: any) {
        set({ error: 'Failed to send message' })
      }
    } finally {
      setSending(false)
    }
  },
}))
