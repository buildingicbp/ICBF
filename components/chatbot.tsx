"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! 👋 I'm your AI fitness coach, ready to help you crush your fitness goals! 💪\n\nI can help you with:\n• Personalized workout plans\n• Nutrition guidance\n• Exercise form tips\n• Progress tracking\n• Goal setting\n\nWhat would you like to work on today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Debug logging
  useEffect(() => {
    console.log('Chatbot isOpen state changed to:', isOpen)
  }, [isOpen])

  // Handle clicks outside the chatbot
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return

      const target = event.target as Node
      
      // Check if click is outside both the chat window and the button
      if (
        chatWindowRef.current && 
        !chatWindowRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    // Add event listener when chat is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const callGeminiAPI = async (userInput: string, conversationHistory: Message[]) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error('Gemini API key not found')
      }

      console.log('Calling Gemini API with key:', apiKey.substring(0, 10) + '...')

      // Format conversation history for Gemini
      const formattedHistory = conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{
                text: `You are an expert fitness training assistant for ICBF (I Can Be Fitter). You should act as a knowledgeable, encouraging, and professional personal trainer. 

Your role is to:
- Provide personalized workout advice and routines
- Give nutrition guidance and meal planning tips
- Help with exercise form and technique
- Track progress and set realistic goals
- Motivate and encourage users
- Answer fitness and health questions
- Recommend appropriate exercises based on fitness level
- Provide injury prevention advice
- Help with weight loss, muscle building, or general fitness goals

Always be encouraging, professional, and provide actionable advice. Keep responses concise but informative. If users ask about specific tools on our website (like BMI calculator, calories calculator), guide them to use those tools.

Current conversation context:
${formattedHistory.map(msg => `${msg.role}: ${msg.parts[0].text}`).join('\n')}

User's latest message: ${userInput}

Please respond as a helpful fitness training assistant:`
              }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      })

      console.log('API Response status:', response.status)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response data:', data)
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        let responseText = data.candidates[0].content.parts[0].text
        
        // Remove asterisks (* and **) from the response
        responseText = responseText.replace(/\*\*/g, '').replace(/\*/g, '')
        
        return responseText
      } else {
        throw new Error('Invalid response format from Gemini API')
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      return "I'm having trouble connecting to my training database right now. Let me provide you with some general fitness advice instead. What specific area would you like to focus on - workouts, nutrition, or goal setting?"
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Get conversation history for context
      const conversationHistory = [...messages, userMessage]
      
      console.log('Sending message to Gemini:', inputValue)
      
      // Call Gemini API
      const botResponse = await callGeminiAPI(inputValue, conversationHistory)
      
      console.log('Received response from Gemini:', botResponse)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error in handleSendMessage:', error)
      
      // Fallback response if API fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to explore our website's tools like the BMI calculator or connect with our human trainers for immediate assistance!",
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    console.log('Toggle chat clicked, current state:', isOpen)
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          ref={buttonRef}
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center cursor-pointer"
        >
          {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="fixed bottom-28 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">AI Fitness Coach</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about workouts, nutrition, or fitness..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 