import {cache} from 'react'
import type {Metadata} from 'next'
import i18n from '../../i18n'
import db from '../../mongo'
import ChatProvider from '../../provider/chat'
import Action from './action'
import Chats from './chats'
import HeaderBack from './header/back'
import HeaderDelete from './header/delete'
import HeaderTitle from './header/title'
import Input from './input'

import css from './page.module.css'

const getGPT = cache((id: string) => db.getGPT(id))

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
  if (gpt) {
    const chats = await db.getGPTChats(params.id)
    return <>
      <div className={css.header}>
        <HeaderBack/>
        <HeaderTitle id={params.id} title={gpt.title}/>
        <HeaderDelete id={params.id}/>
      </div>
      <ChatProvider defaultChats={chats.map(chat => ({...chat, _id: chat._id.toString()}))}>
        <div className={css.chats}>
          <Chats context={gpt.context}/>
        </div>
        <div className={css.panel}>
          <div className={css.action}>
            <Action id={params.id} defaultContext={gpt.context} defaultConfig={gpt.config}/>
          </div>
          <div className={css.input}>
            <Input id={params.id} context={gpt.context} config={gpt.config}/>
          </div>
        </div>
      </ChatProvider>
    </>
  }
}
