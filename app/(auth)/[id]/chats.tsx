'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import Markdown from 'react-markdown'
import throttle from '../../helper/throttle'
import type {GPT} from '../../mongo'
import {useChatContext} from '../../provider/chat'

import css from './chats.module.css'

export default function Chats ({context}: {context: GPT['context']}) {
  const ref = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true) // 自动滚动
  const {chats} = useChatContext()

  const scrollHandle = useMemo(() => throttle((e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if ((e.target as HTMLDivElement).scrollHeight - (e.target as HTMLDivElement).clientHeight - (e.target as HTMLDivElement).scrollTop > 10) {
      setAutoScroll(false)
    } else {
      setAutoScroll(true)
    }
  }, 200, {leading: true}), [])

  useEffect(() => {
    if (autoScroll) {
      ref.current?.scrollTo({top: ref.current.scrollHeight})
    }
  }, [autoScroll, chats])

  return <>
    <div ref={ref} className={css.main} onScroll={scrollHandle}>
      {context.map((i, index) => <div key={index} className={i.role === 'user' ? css.chatUser : css.chat}>
        <div className={css.content}>
          <Markdown>{i.content}</Markdown>
        </div>
      </div>)}
      {chats.map(chat => <div key={chat._id.toString()} className={chat.role === 'user' ? css.chatUser : css.chat}>
        <div className={css.content}>
          <Markdown>{chat.content}</Markdown>
        </div>
      </div>)}
    </div>
    {!autoScroll && <button className={`i-down-arrow-alt ${css.toBottom}`} onClick={() => ref.current?.scrollTo({top: ref.current.scrollHeight, behavior: 'smooth'})}/>}
  </>
}
