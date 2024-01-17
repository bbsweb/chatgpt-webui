import {cache} from 'react'
import Markdown from 'react-markdown'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import i18n from '../../i18n'
import db from '../../mongo'

import css from './page.module.css'

const getGPT = cache((id: string) => db.getShareGpt(id))

export const generateMetadata = async ({params}: {params: {id: string}}): Promise<Metadata> => {
  const gpt = await getGPT(params.id)
  const {t} = await i18n()
  if (gpt) {
    return {
      title: gpt.title || t('new chat')
    }
  }
  return {title: '404'}
}

export default async ({params}: {params: {id: string}}) => {
  const gpt = await getGPT(params.id)
  const {t} = await i18n('chatgpt')
  if (gpt) {
    const chats = await db.getGPTChats(params.id)
    return <div className={css.main}>
      <h1 className={css.title}>{gpt.title || t('new chat')}</h1>
      {gpt.context.map((i, index) => <div key={index} className={i.role === 'user' ? css.chatUser : css.chat}>
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
  }
  notFound()
}
