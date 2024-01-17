'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import type {GPT} from '../../mongo'
import {useI18n} from '../../store'
import {addGPTChatAction, updateGPTChatAction} from '../../action'
import {useGPTContext} from '../../provider'
import {useChatContext} from '../../provider/chat'
import useApi from '../../useApi'

import css from './input.module.css'

export default function Input ({id, context, config}: {id: string, context: GPT['context'], config: GPT['config']}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const cancelRef = useRef<() => void>()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const {t} = useI18n()
  const {chats, dispatchChats} = useChatContext()
  const {setting} = useGPTContext()
  const api = useApi()

  const historys = useMemo(() => {
    const count = typeof config.send_history === 'undefined' ? setting.send_history : config.send_history
    if (count <= 0) return []

    return chats.slice(-count).map(({role, content}) => ({role, content}))
  }, [chats, config.send_history, setting.send_history])

  const send = () => {
    if (!input) return // 如果输入为空，则不发送

    setInput('')
    setLoading(true)
    addGPTChatAction(id, {role: 'user', content: input}).
      then(payload => {
        dispatchChats({type: 'add', payload})
        return addGPTChatAction(id, {role: 'assistant', content: '加载中...'})
      }).
      then(payload => {
        dispatchChats({type: 'add', payload})
        const req = api.chat.completions({
          messages: [...context, ...historys, {role: 'user', content: input}],
          config: config.chat,
          onData: content => dispatchChats({type: 'update', payload: {_id: payload._id, content}}),
          onDone: content => {
            updateGPTChatAction(payload._id, id, content)
            setLoading(false)
          },
          onError: e => {
            const content = `\`\`\`json\n${e}\n\`\`\``
            dispatchChats({type: 'update', payload: {_id: payload._id, content}})
            updateGPTChatAction(payload._id, id, content)
            setLoading(false)
          }
        })
        cancelRef.current = req.cancel
      })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return

    if (
      (setting.sendKey === '1' && e.ctrlKey) ||
      (setting.sendKey === '2' && e.shiftKey) ||
      (setting.sendKey === '3' && e.altKey) ||
      (setting.sendKey === '4' && e.metaKey)
    ) {
      e.preventDefault()
      send()
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }, [input])

  return <>
    <textarea ref={ref} rows={1} className={css.textarea} placeholder={t('placeholder')} value={input} onChange={e => setInput(e.currentTarget.value)} onKeyDown={handleKeyDown}/>
    {loading ? 
      <button className={`${css.cancel} i-pause`} onClick={() => cancelRef.current && cancelRef.current()}/> : 
      <button className={`${css.send} i-send`} disabled={!input} onClick={send}/>
    }
  </>
}
