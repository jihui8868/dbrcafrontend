import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MessageContentProps {
  content: string
}

export function MessageContent({ content }: MessageContentProps) {
  return (
    <ReactMarkdown
      components={{
        // Text rendering
        p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,

        // Headings
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,

        // Code blocks
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : 'text'

          if (!inline) {
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                className="rounded-lg my-4 overflow-x-auto"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            )
          }

          return (
            <code
              className="bg-opacity-20 px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          )
        },

        // Lists
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
        ),
        li: ({ node, ...props }) => <li className="ml-4" {...props} />,

        // Tables
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-gray-300" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-gray-200" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="border border-gray-300 px-4 py-2 text-left font-semibold" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-300 px-4 py-2" {...props} />
        ),

        // Blockquotes
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-primary pl-4 my-4 text-gray-600 italic"
            {...props}
          />
        ),

        // Links
        a: ({ node, ...props }) => (
          <a
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),

        // Images
        img: ({ node, ...props }) => (
          <img className="max-w-full rounded-lg my-4" {...props} alt="" />
        ),

        // Horizontal line
        hr: ({ node, ...props }) => <hr className="my-4 border-gray-300" {...props} />,

        // Line breaks
        br: () => <br />,
      }}
      children={content}
    />
  )
}
