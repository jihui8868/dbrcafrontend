import React from 'react'
import { Message } from '../types'
import { MessageContent } from './MessageContent'
import { User, Bot } from 'lucide-react'

interface MessageItemProps {
  message: Message
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}

      <div
        className={`max-w-2xl ${
          isUser
            ? 'bg-primary text-white rounded-2xl rounded-tr-sm'
            : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm'
        } px-4 py-2`}
      >
        <div className="prose prose-sm max-w-none">
          <MessageContent content={message.content} />
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  )
}
