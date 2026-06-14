import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/chat'
import { MessageItem } from './MessageItem'
import { ChatInput } from './ChatInput'
import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router-dom'

export function ChatWindow() {
  const {
    currentConversation,
    messages,
    isLoading,
    isSending,
    error,
    createConversation,
  } = useChatStore()
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isComposing, setIsComposing] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!currentConversation && !isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">DBRCA Chat</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            登出
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              开始对话
            </h2>
            <p className="text-gray-600 mb-6">选择左边的对话或创建新对话</p>
            <button
              onClick={createConversation}
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {isLoading ? '创建中...' : '新建对话'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">DBRCA Chat</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          登出
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-gray-500 text-lg">开始对话</p>
              <p className="text-gray-400 text-sm">在下面输入您的问题</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 max-w-xs">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-t border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Input */}
      {currentConversation && (
        <ChatInput
          onComposing={setIsComposing}
          disabled={isSending || isComposing}
        />
      )}
    </div>
  )
}
