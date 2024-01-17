'use client'

import {type Dispatch, createContext, useContext, useReducer} from 'react'
import type {GPTChat} from '../mongo'

type Chat = {
  _id: string
} & GPTChat

type Action = {
  type: 'delete'
  payload: string
} | {
  type: 'add'
  payload: Chat
} | {
  type: 'update'
  payload: {
    _id: string
    content: string
  }
}

type ContextProps = {
  chats: Chat[]
  dispatchChats: Dispatch<Action>
}

const reducer = (chats: Chat[], action: Action) => {
  switch (action.type) {
  case 'delete':
    return chats.filter(i => i._id !== action.payload)
  case 'add':
    return [...chats, action.payload]
  case 'update': {
    const copy = [...chats]
    const index = copy.findIndex(i => i._id === action.payload._id)
    if (index >= 0) {
      copy[index].content = action.payload.content
    } 
    return copy
  }
  default:
    throw new Error('action type not exist')
  }
}

const ChatContext = createContext<ContextProps>({} as ContextProps)
export const useChatContext = () => useContext<ContextProps>(ChatContext)
export default function ChatProvider ({children, defaultChats}: {children: React.ReactNode, defaultChats: Chat[]}) {
  const [chats, dispatchChats] = useReducer(reducer, defaultChats)

  return <ChatContext.Provider value={{chats, dispatchChats}}>
    {children}
  </ChatContext.Provider>
}
