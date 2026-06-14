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
      set({ currentConversation: conversation, messages: [] })
    }
  },

  addMessage: (message: Message) => {
    const { messages } = get()
    set({ messages: [...messages, message] })
  },

  sendMessage: async (content: string) => {
    const { currentConversation, addMessage, setSending } = get()
    if (!currentConversation) return

    setSending(true)
    set({ error: null })

    try {
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content,
      })

      let fullResponse = ''
      const messageId = Date.now().toString()

      try {
        const reader = await apiClient.sendMessage(currentConversation.id, content)
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === 'text') {
                  fullResponse += data.content
                  addMessage({
                    id: messageId,
                    role: 'assistant',
                    content: fullResponse,
                  })
                } else if (data.type === 'error') {
                  set({ error: data.content })
                }
              } catch (e) {
                // Ignore JSON parse errors for incomplete data
              }
            }
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
