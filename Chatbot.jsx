import React, { useState, useRef, useEffect } from 'react'
import { chatWithAI } from '../utils/aiService'
import { useLanguage } from '../contexts/LanguageContext'
import './Chatbot.css'

export default function Chatbot() {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: t('chatbotGreeting'),
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setInputValue('')

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }))
      conversationHistory.push({
        role: 'user',
        content: messageText
      })

      const result = await chatWithAI(conversationHistory, language)
      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: result.success ? result.response : `❌ ${result.response}`,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: `❌ ${t('chatbotError')}`,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    await sendMessage(inputValue)
  }

  const suggestedQuestions = [
    t('chatbotQuestion1'),
    t('chatbotQuestion2'),
    t('chatbotQuestion3'),
    t('chatbotQuestion4')
  ]

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>{t('chatbotHeader')}</h1>
        <p>{t('chatbotDescription')}</p>
      </div>

      <div className="chatbot-content">
        <div className="messages-area">
          {messages.length === 1 && (
            <div className="suggested-questions">
              <h3>{t('popularQuestions') || 'Popular Questions:'}</h3>
              <div className="question-grid">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    className="question-btn"
                    onClick={() => {
                      setInputValue(question)
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="chat-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('chatbotPlaceholder')}
              disabled={isLoading}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="send-btn"
            >
              {isLoading ? t('responseLoading') : '➤'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
